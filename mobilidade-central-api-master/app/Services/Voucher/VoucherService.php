<?php

namespace App\Services\Voucher;

use App\Constants\Balance\BalanceFlowConst;
use App\Models\Voucher\VoucherPurchase;
use App\Repositories\Balance\BalanceFlowRepository;
use App\Repositories\Balance\BalanceRepository;
use App\Repositories\Central\CentralRepository;
use App\Repositories\Transaction\TransactionRepository;
use App\Repositories\User\UserRepository;
use App\Repositories\Acquirer\AcquirerRepository;
use App\Repositories\Voucher\VoucherPurchaseRepository;
use App\Repositories\Voucher\VoucherRepository;
use App\Utils\ConfianceCheckout;

class VoucherService
{
    /**
     * @var AcquirerRepository
     */
    private $acquirerRepository;

    public function __construct(VoucherRepository $repository,
                                AcquirerRepository $acquirerRepository)
    {
        $this->repository = $repository;
        $this->acquirerRepository = $acquirerRepository;
    }

    public function addVoucher($responsibleId, $bonusVoucher){
        $balanceRepository = new BalanceRepository();
        $centralRepository = new CentralRepository();
        $balanceFlowRepository = new BalanceFlowRepository();

        $central = $centralRepository->findByResponsible($responsibleId);

        if($central->balanceId == 0){
            $central->balanceId = $balanceRepository->createBalance()->idBalance;
            $centralRepository->updateBalanceId($responsibleId, $central->balanceId);
        }

        $currentBalance = $balanceRepository->findById($central->balanceId)->tripBalance;

        $balanceFlowRepository->insert($bonusVoucher, BalanceFlowConst::VOUCHER_PURCHASE_CENTRAL, $central->balanceId);

        return $balanceRepository->updateBalance($central->balanceId, 'tripBalance', (floatval($bonusVoucher) + floatval($currentBalance)));
    }

    public function findAcquirer(){
        $acquirer = $this->acquirerRepository->findById(8);

        $acquirer->map(function ($acquirer) {
            if(empty($acquirer->value)) {
                throw new \Exception('No momento estamos com problemas para gerar a cobrança via pix, por favor, tente outro meio de pagamento');
            }
        });

        return new ConfianceCheckout($acquirer[0]->value, $acquirer[1]->value);
    }

    public function doPayment($request) {
        $confiance = $this->findAcquirer();

        $paymentData = array(
            'value' => $request->value,
            'description' => 'Voucher para central',
            'customer_name' => $request->cardHolder,
            'customer_document' => $request->userDocument,
            'customer_email' => 'speedapps@hotmail.com',
            'customer_birth_date' => "1999-09-10",
            'customer_phone_number' => "99 99999-9999",
            'customer_zicode' => $request->userCEP,
            'customer_address' => 'S/A',
            'customer_complement' => 'S/C',
            'customer_number' => 'S/N',
            'customer_city' => $request->userCity,
            'customer_state' => $request->userUF,
            'card_number' => $request->cardNumber,
            'card_holder' => $request->cardHolder,
            'card_validate' => $request->cardValidated,
            'card_cvc' => $request->cardCVV,
        );

        $transaction = $confiance->creditPayment($paymentData);

        if(!$transaction['success']) throw new \Exception('A compra não foi aprovada');

        $this->registerTransaction($transaction['pedido'], $request->responsibleId, $request->bonusVoucher, 1);

        $includeVoucher = $this->addVoucher($request->responsibleId, $request->bonusVoucher);

        if(!$includeVoucher) {
            $confiance->refundCreditPayment($transaction['pedido']->id);
            throw new \Exception('Ocorreu um erro ao criar saldo para esta central, o valor creditado será extornado');
        }

        return $transaction;
    }

    public function validateCharge($request) {
        $confiance = $this->findAcquirer();

        $user = (new UserRepository)->findWithCustomer($request->responsibleId);

        if($user == ''){
            throw new \Exception('Não foi possível encontrar as informações do responsável por essa central, reveja as configurações do responsável e tente novamente');
        }

        $chargeData = array(
            'value' => $request->value,
            'description' => 'Voucher para central',
            'customer_name' => $user->name,
            'customer_document' => $user->document,
            'customer_email' => empty($user->email ? 'speedapps@hotmail.com' : $user->email),
            'customer_birth_date' => $user->dateOfBirth ?? null,
            'customer_phone_number' => $user->phone,
            'customer_zicode' => $user->zipcode,
            'customer_address' => 'S/A',
            'customer_complement' => 'S/C',
            'customer_number' => 'S/N',
            'customer_city' => 'FORTALEZA',
            'customer_state' => 'CE',
        );

        $resultConfiance = $confiance->pixPayment($chargeData);
        $resultConfiance['pedido']->tipo_pedido_id = 4;

        $this->registerTransaction($resultConfiance['pedido'], $request->responsibleId, $request->bonusVoucher);

        return $resultConfiance;
    }

    private function registerTransaction($data, $responsibleId, $bonusVoucher, $transactionStatus = 3){
        $transactionRegistered = (new TransactionRepository)->register($data, $responsibleId, $transactionStatus);

        (new VoucherPurchaseRepository)->register($transactionRegistered, $bonusVoucher);
    }
}
