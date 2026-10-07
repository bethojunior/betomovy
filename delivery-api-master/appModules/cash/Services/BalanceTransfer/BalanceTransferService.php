<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 22/07/2020
 * Time: 17:35
 */

namespace Cash\Services\BalanceTransfer;


use App\Models\Balance\Balance;
use App\Models\Balance\BalanceFlow;
use App\Models\User;
use Cash\Constants\Balance\BalanceFlowTypeConst;
use Cash\Exceptions\BalanceTransfer\InsufficientBalanceException;
use Cash\Models\BalanceTransfer\BalanceTransfer;
use Cash\Models\BalanceTransfer\TransferBalanceFlow;
use Cash\Repositories\Balance\BalanceRepository;
use Cash\Repositories\BalanceTransfer\BalanceTransferRepository;

class BalanceTransferService
{
    /**
     * @var BalanceRepository
     */
    private $balanceRepository;
    /**
     * @var BalanceTransferRepository
     */
    private $balanceTransferRepository;

    public function __construct(BalanceRepository $balanceRepository,
                                BalanceTransferRepository $balanceTransferRepository)
    {
        $this->balanceRepository = $balanceRepository;
        $this->balanceTransferRepository = $balanceTransferRepository;
    }

    public function transfer(array $request, User $user): BalanceTransfer
    {
        /** @var Balance $fromBalance */
        $fromBalance = $this->balanceRepository
            ->findByUser($user->idUser);

        if ($fromBalance->balance < $request['value'])
            throw new InsufficientBalanceException;

        \DB::beginTransaction();

        try {
            /** @var Balance $toBalance */
            $toBalance = $this->balanceRepository
                ->findByUser($request['userId']);

            $balanceTransfer = new BalanceTransfer;
            $balanceTransfer->fromBalanceId = $fromBalance->idBalance;
            $balanceTransfer->toBalanceId = $toBalance->idBalance;
            $balanceTransfer->description = $request['description'] ?? null;
            $balanceTransfer->value = $request['value'];
            $balanceTransfer->cashPaymentFormId = $request['cashPaymentFormId'];
            $balanceTransfer->save();

            $this->debitBalance($fromBalance, $balanceTransfer, $request['value']);
            $this->creditBalance($toBalance, $balanceTransfer, $request['value']);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollBack();

            throw $e;
        }


        return $balanceTransfer;
    }

    public function financialStatement(User $user, array $request)
    {
        return $this->balanceTransferRepository
            ->financialStatementByUser($user->idUser, $request);
    }

    public function findOne(int $id): BalanceTransfer
    {
        /** @var BalanceTransfer $balanceTransfer */
        $balanceTransfer = $this->balanceTransferRepository->findFully($id);

        return $balanceTransfer;
    }

    /**
     * @param Balance $balance
     * @param BalanceTransfer $balanceTransfer
     * @param float $value
     * @return Balance
     */
    private function creditBalance(Balance $balance, BalanceTransfer $balanceTransfer, float $value): Balance
    {
        $balance->increment('balance', round($value, 2));

        $balanceFlow = BalanceFlow::create([
            'balanceId' => $balance->idBalance,
            'value' => $value,
            'balanceFlowTypeId' => BalanceFlowTypeConst::BALANCE_TRANSFER_RECEIVED,
        ]);

        TransferBalanceFlow::create([
            'balanceTransferId' => $balanceTransfer->id,
            'balanceFlowId' => $balanceFlow->idBalanceFlow
        ]);

        return $balance;
    }

    /**
     * @param Balance $balance
     * @param BalanceTransfer $balanceTransfer
     * @param float $value
     * @return Balance
     */
    private function debitBalance(Balance $balance, BalanceTransfer $balanceTransfer, float $value): Balance
    {
        $balance->decrement('balance', round($value, 2));

        $balanceFlow = BalanceFlow::create([
            'balanceId' => $balance->idBalance,
            'value' => $value,
            'balanceFlowTypeId' => BalanceFlowTypeConst::BALANCE_TRANSFER,
        ]);

        TransferBalanceFlow::create([
            'balanceTransferId' => $balanceTransfer->id,
            'balanceFlowId' => $balanceFlow->idBalanceFlow
        ]);

        return $balance;
    }
}
