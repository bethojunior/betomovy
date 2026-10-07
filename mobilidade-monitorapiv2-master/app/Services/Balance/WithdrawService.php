<?php

namespace App\Services\Balance;

use App\Constants\Acquirer\Acquirer;
use App\Constants\Push\PushConfigConst;
use App\Exceptions\Balance\WithdrawAlreadyConfirmedException;
use App\Exceptions\Balance\WithdrawTransferException;
use App\Helpers\Push\PushHelper;
use App\Models\Acquirer\FinancialIntermediary;
use App\Models\Balance\BalanceFlow;
use App\Models\Balance\BankAccount;
use App\Models\Balance\Withdraw;
use App\Models\User\User;
use App\Repositories\Balance\WithdrawRepository;
use App\Repositories\Balance\WithdrawSummaryViewRepository;
use App\Services\FinancialIntermediary\FinancialIntermediaryService;
use App\Utils\Acquirers\ZsPay\ZsPay;
use App\Utils\FormatValue;
use Exception;
use http\Message;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use SpeedApps\PaySoon\PaySoon;

class WithdrawService
{
    private $repository;
    private $pushHelper;
    private $financialIntermediaryService;
    private $withdrawRepository;

    function __construct(WithdrawSummaryViewRepository $repository, PushHelper $pushHelper, FinancialIntermediaryService $financialIntermediaryService, WithdrawRepository $withdrawRepository)
    {
        $this->repository = $repository;
        $this->pushHelper = $pushHelper;
        $this->financialIntermediaryService = $financialIntermediaryService;
        $this->withdrawRepository = $withdrawRepository;
    }

    public function findAll(?array $request = [], int $cityId = null)
    {
        return $this->repository->findAll($request, $cityId, (bool)(Auth::user())->role->support);
    }

    public function confirm(User $confirmerUser, Withdraw $withdraw, bool $type = true): bool
    {
        try {
            DB::beginTransaction();
            if ($withdraw->paid)
                throw new WithdrawAlreadyConfirmedException;
            $withdraw->paid = true;
            $withdraw->paymentDate = now();
            $withdraw->paidByUser = $confirmerUser->idUser;
            $withdraw->bankAccount = $this->mountBankAccountString($withdraw);
            $withdraw->save();
            $balance = $withdraw->balance;
            $balance->decrement('pendingBalanceWithdraw', $withdraw->value);

            $this->transferAcquirer($this->financialIntermediaryService->findByActive(), $withdraw);

            $this->pushHelper->sendByKey(PushConfigConst::CONFIRMED_WITHDRAW, $withdraw->user->deviceToken);
            DB::commit();
            return true;
        } catch (WithdrawAlreadyConfirmedException|WithdrawTransferException $e) {
            DB::rollBack();
            return false;
        }
    }

    public function confirmMultiples(User $confirmerUser, array $withdraws = []): bool
    {
        try {
            DB::beginTransaction();
            foreach ($withdraws['withdraws'] as $withdrawId) {
                $withdraw = $this->withdrawRepository->find($withdrawId);
                if ($withdraw->paid)
                    throw new WithdrawAlreadyConfirmedException;
                $withdraw->paid = true;
                $withdraw->paymentDate = now();
                $withdraw->paidByUser = $confirmerUser->idUser;
                $withdraw->bankAccount = $this->mountBankAccountString($withdraw);
                $withdraw->save();
                $balance = $withdraw->balance;
                $balance->decrement('pendingBalanceWithdraw', $withdraw->value);

                $this->transferAcquirer($this->financialIntermediaryService->findByActive(), $withdraw);

                $this->pushHelper->sendByKey(PushConfigConst::CONFIRMED_WITHDRAW, $withdraw->user->deviceToken);
            }
            DB::commit();
            return true;
        } catch (WithdrawAlreadyConfirmedException|WithdrawTransferException $e) {
            DB::rollBack();
            return false;
        }
    }

    public function reject(User $cancelingUser, Withdraw $withdraw, $reason): bool
    {
        try {
            DB::beginTransaction();
            if ($withdraw->paid)
                throw new WithdrawAlreadyConfirmedException;
            $withdraw->recused = true;
            $withdraw->reason = $reason;
            $withdraw->refusalDate = now();
            $withdraw->recusedByUser = $cancelingUser->idUser;
            $withdraw->save();
            $balanceFlow = new BalanceFlow();
            $balanceFlow->balanceFlowTypeId = 87;
            $balanceFlow->value = $withdraw->value;
            $balanceFlow->date = now();
            $balanceFlow->balanceId = $withdraw->balanceId;
            $balanceFlow->withdrawId = $withdraw->idWithdraw;
            $balanceFlow->save();
            $balance = $withdraw->balance;
            $balance->decrement('pendingBalanceWithdraw', $withdraw->value);
            $balance->increment('balance', $withdraw->value);
            $this->pushHelper->sendByKey(PushConfigConst::DENIED_WITHDRAW, $withdraw->user->deviceToken);
            DB::commit();
            return true;
        } catch (WithdrawAlreadyConfirmedException $e) {
            DB::rollBack();
            return false;
        }
    }

    public function accountBalance()
    {
        try {
            $financialIntermediary = $this->financialIntermediaryService->findByActive();
            if ((bool)$financialIntermediary->acquirerMetaData[2]->value) {
                return $this->accountBalanceAcquirer($financialIntermediary);
            }
            throw new Exception('Adquirente não habilitada para split.');
        } catch (\Exception $e) {
            return false;
        }
    }

    public function findAccountByWithdrawId($withdrawId)
    {
        return $this->repository->findByWithdrawId($withdrawId);
    }

    private function mountBankAccountString(Withdraw $withdraw): string
    {
        $bankAccount = $withdraw->user->bankAccount;
        if (!$bankAccount) {
            return 'Conta não informada';
        }

        if ($bankAccount->bank) {
            return $this->mountFullBankAccountString($bankAccount);
        }

        if ($bankAccount->pix) {
            return $this->mountPixAccountString($bankAccount);
        }

        return 'Conta não informada';
    }

    private function mountFullBankAccountString(BankAccount $bankAccount): string
    {
        $string = "Banco: " . $bankAccount->bank->bankNumber . " - " . $bankAccount->bank->bankName . ", ";
        $string .= "Agencia: " . $bankAccount->agency . ($bankAccount->agencyDigit ? '-' . $bankAccount->agencyDigit : '') . ", ";
        $string .= "Numero: " . $bankAccount->numberAccount . "-" . $bankAccount->numberAccountDigit . ", ";
        if ($bankAccount->op)
            $string .= "OP: " . $bankAccount->op . ", ";
        $string .= "Tipo de Conta: " . $bankAccount->typeAccount . ", ";

        return $string . $this->mountHolderString($bankAccount);
    }

    private function mountPixAccountString(BankAccount $bankAccount): string
    {
        return "PIX: " . $bankAccount->pix . ", " . $this->mountHolderString($bankAccount);
    }

    private function mountHolderString(BankAccount $bankAccount): string
    {
        $string = '';
        if ($bankAccount->document)
            $string .= "Documento: " . $bankAccount->document . ", ";
        $string .= "Titular: " . $bankAccount->holderName;

        return $string;
    }

    private function transferAcquirer(FinancialIntermediary $financialIntermediary, Withdraw $withdraw, bool $type = true)
    {
        switch ($financialIntermediary->idFinancialIntermediary) {
            case Acquirer::ZSPAY:
            {
                if (isset($financialIntermediary->acquirerMetaData[2]) && (bool)$financialIntermediary->acquirerMetaData[2]->value) {
                    if ((bool)$financialIntermediary->acquirerMetaData[3]->value)
                        throw new Exception('Conta externa não habilitada');

                    $token = $financialIntermediary->acquirerMetaData[0]->value;
                    $zsPay = new ZsPay($token, $this->getEnvironment());
                    $establishment = $zsPay->getEstablishment()->findByDocument(FormatValue::formatDocumentClear($withdraw->user->document));

                    if (!!$establishment === false) {
                        if (is_object($establishment) && $establishment->success) {
                            $transfer = [
                                "tipoTransferencia" => 1,
                                "toEstabelecimentoId" => $establishment->estabelecimento->id,
                                "valor" => $withdraw->value,
                                "senha" => null,
                                "descricao" => "Solicitação de Transferência ",
                            ];
                            $result = $zsPay->getTransfer()->create($transfer);

                            if (!$result->success)
                                throw new WithdrawTransferException($result->message);

                        }
                        throw new Exception('Erro ao realizer transferência.');
                    }
                } else {
                   return ['message'=>'Sucesso ao realizar transferência.'];
                }
                break;
            }
            case Acquirer::PAYSOON:
            {
                if (isset($financialIntermediary->acquirerMetaData[2]) && (bool)$financialIntermediary->acquirerMetaData[2]->value) {
                    $user = $financialIntermediary->acquirerMetaData[0]->value;
                    $password = $financialIntermediary->acquirerMetaData[1]->value;
                    $paySoon = new PaySoon($user, $password, $this->getEnvironment());

                    $data = array(
                        "valorSolicitado" => FormatValue::formatForReal($withdraw->value),
                        "tipo" => $type ? 'cartao' : 'boleto',
                        "contaBancaria" => array(
                            "numeroAgencia" => $withdraw->user->bankAccount->agency,
                            "digitoAgencia" => $withdraw->user->bankAccount->agencyDigit,
                            "numeroConta" => $withdraw->user->bankAccount->numberAccount,
                            "digitoConta" => $withdraw->user->bankAccount->numberAccountDigit,
                            "tipo" => $withdraw->user->bankAccount->typeAccount,
                            "titular" => array(
                                "nome" => $withdraw->user->bankAccount->holderName,
                                "cpfCnpj" => FormatValue::formatDocumentClear($withdraw->user->bankAccount->document),
                            ),
                            "banco" => array(
                                "codigo" => $withdraw->user->bankAccount->bank->bankNumber
                            )
                        )
                    );

                    $result = $paySoon->getTransfer()->transfer($data);

                    if ($result->responseStatus[0]->status != 'ok' && empty($result->data)) {
                        throw new WithdrawTransferException($result->responseStatus[0]->mensagem);
                    }
                    break;
                } else {
                    throw new Exception('Adquirente não habilitada para split.');
                }
            }
            default:
                break;
        }
    }

    private function accountBalanceAcquirer(FinancialIntermediary $financialIntermediary)
    {
        switch ($financialIntermediary->idFinancialIntermediary) {
            case Acquirer::ZSPAY:
            {
                if (isset($financialIntermediary->acquirerMetaData[2]) && (bool)$financialIntermediary->acquirerMetaData[2]->value) {
                    $token = $financialIntermediary->acquirerMetaData[0]->value;
                    $idEstablishment = $financialIntermediary->acquirerMetaData[1]->value;
                    $zsPay = new ZsPay($token, $this->getEnvironment());
                    $accountBalance = $zsPay->getBalance()->accountBalance($idEstablishment);
                    if (is_object($accountBalance) && $accountBalance->success) {
                        return ['saldo' => $accountBalance->saldo->atual];
                    }
                    throw new Exception('Erro ao consultar saldo');
                } else {
                    throw new Exception('Adquirente não habilitada para split.');
                }
            }
            case
            Acquirer::PAYSOON:
            {
                if (isset($financialIntermediary->acquirerMetaData[2]) && (bool)$financialIntermediary->acquirerMetaData[2]->value) {
                    $user = $financialIntermediary->acquirerMetaData[0]->value;
                    $password = $financialIntermediary->acquirerMetaData[1]->value;
                    $environment = (env('APP_ENV') == 'local') ? 'homologation' : 'production';
                    $paySoon = new PaySoon($user, $password, $environment);

                    $resultCard = $paySoon->getBalance()->accountBalance("cartao");
                    $resultBillet = $paySoon->getBalance()->accountBalance("boleto");

                    if (($resultCard->responseStatus[0]->status != 'ok' && empty($resultCard->data)) && ($resultBillet->responseStatus[0]->status != 'ok' && empty($resultBillet->data))) {
                        throw new WithdrawTransferException($resultCard->responseStatus[0]->mensagem . '\n' . $resultBillet->responseStatus[0]->mensagem);
                    }
                    return ['card' => $resultCard->data, 'billet' => $resultBillet->data];
                } else {
                    throw new Exception('Adquirente não habilitada para split.');
                }
            }
            default:
                break;
        }
    }

    private
    function getEnvironment(): string
    {
        return "homologation";
    }

}
