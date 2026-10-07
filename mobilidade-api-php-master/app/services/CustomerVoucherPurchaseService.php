<?php

namespace app\services;

use app\constant\CustomerBalanceConst;
use app\constant\TransactionConst;
use app\dao\BalanceDao;
use app\dao\BalanceFlowDao;
use app\model\BalanceFlow;
use Exception;
use app\model\Transaction;
use app\model\VoucherPurchase;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 18/12/2018
 * Time: 11:11
 */
class CustomerVoucherPurchaseService
{
    private $balanceDao;

    /** @var \app\model\Transaction $transaction */
    private $transaction;

    public function __construct()
    {
        $this->balanceDao = new BalanceDao;
    }

    /**
     * @param \app\model\Transaction $transaction
     * @param VoucherPurchase $voucherPurchase
     * @param $balanceId
     * @return array|bool|mixed
     * @throws Exception
     */
    public function manageTripBalance(Transaction $transaction, VoucherPurchase $voucherPurchase, $balanceId)
    {
        $this->transaction = $transaction;

        if ($transaction->getTransactionStatusId() == TransactionConst::COMPLETED) {
            return $this->addBalance($balanceId, $voucherPurchase->getAmount());
        }

        return false;
    }

    /**
     * @param $balanceId
     * @param $amount
     * @return array|mixed
     * @throws Exception
     */
    private function addBalance($balanceId, $amount)
    {
        $balance = $this->balanceDao
            ->find($balanceId);

        $balance->tripBalance += $amount;
        $this->balanceDao->updateTripBalance($balanceId, $balance->tripBalance);

        $this->insertBalanceFlow(CustomerBalanceConst::VOUCHER_PURCHASE, $amount, $balanceId);

        return $balance;
    }

    /**
     * @param $type
     * @param $amount
     * @param $balanceId
     * @return \app\model\BalanceFlow
     */
    private function insertBalanceFlow($type, $amount, $balanceId): BalanceFlow
    {
        $balanceFlow = (new BalanceFlowDao)
            ->insertWithTransaction($amount, $type, $balanceId, $this->transaction->getIdTransaction());

        return $balanceFlow;
    }
}