<?php

namespace App\Helpers\Checkout\Traits;

use App\Constants\Acquirer\Acquirer;
use App\Constants\Transaction\TransactionConst;
use App\Models\Transaction\Transaction;

trait FeedTransactionByAcquirerResponse
{
    public function feed(int $intermediary_id, Transaction $transaction, array $paymentData): Transaction
    {
        switch ($intermediary_id) {
            case Acquirer::PAY704:
                return $this->feedBy704Pay($transaction, $paymentData);
            default:
                return $transaction;
        }
    }

    private function feedBy704Pay(Transaction $transaction, array $paymentData): Transaction
    {
        if (!empty($paymentData['payment_status_id'])) {
            $transaction->status = $paymentData['payment_status_id'];
            $transaction->status_detailed = $paymentData['payment_status_id'];

            if ($paymentData['payment_status_id'] == 1) {
                $transaction->transactionStatusId = TransactionConst::APPROVED;
            } else if ($paymentData['payment_status_id'] == 2) {
                $transaction->transactionStatusId = TransactionConst::PENDING;
            } else if ($paymentData['payment_status_id'] == 3) {
                $transaction->transactionStatusId = TransactionConst::CANCELED;
            }
        }

        $transaction->save();

        return $transaction;
    }
}
