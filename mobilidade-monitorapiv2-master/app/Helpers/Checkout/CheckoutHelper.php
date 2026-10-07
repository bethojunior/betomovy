<?php

namespace App\Helpers\Checkout;

use App\Documents\TransactionLog;
use App\Exceptions\Checkout\CheckoutException;
use App\Helpers\Checkout\Traits\DiscoverAcquirer;
use App\Helpers\Checkout\Traits\FeedTransactionByAcquirerResponse;
use App\Models\Transaction\Transaction;
use App\Utils\Pay704\Exceptions\NoResponseFromServerException;
use App\Utils\Pay704\Exceptions\Pay704Exception;
use App\Utils\Pay704\Exceptions\ServerErrorException;

class CheckoutHelper
{
    use DiscoverAcquirer, FeedTransactionByAcquirerResponse;

    /**
     * @param Transaction $transaction
     * @return Transaction
     * @throws CheckoutException
     * @throws NoResponseFromServerException
     * @throws Pay704Exception
     * @throws ServerErrorException
     */
    public function captureAmount(Transaction $transaction): Transaction
    {
        $checkout = $this->getCheckout($transaction->intermediaryId);

        $payment = $checkout->captureAmount($transaction->generatedPaymentId, $transaction->value);

        $transaction = $this->feed($transaction->intermediaryId, $transaction, $payment);

        TransactionLog::create([
            'userId' => (string) auth()->id(),
            'idReference' => $transaction->idTransaction,
            'data' => (object)[
                'transaction' => $transaction->toArray(),
                'paymentData' => $payment
            ]
        ]);

        return $transaction;
    }
}
