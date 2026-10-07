<?php

namespace app\commands;

use app\constant\CheckoutStatusConst;
use app\constant\TransactionConst;
use app\dao\TransactionLogDao;
use app\exceptions\CheckoutServiceException;
use app\model\Transaction;
use app\model\TransactionLog;
use app\services\CheckoutService;
use app\services\TransactionService;
use app\services\TripCardPaymentService;
use app\services\VoucherPurchaseService;
use app\utils\Command;
use Exception;
use stdClass;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 08/03/2019
 * Time: 11:26
 */
class TripCardPaymentCommand extends Command
{
    private $checkoutService;
    private $transactionService;
    private $voucherPurchaseService;
    private $tripCardPaymentService;

    /**
     * TripCardPaymentCommand constructor.
     * @param null $params
     * @throws CheckoutServiceException
     */
    public function __construct($params = null)
    {
        parent::__construct($params);
        $this->checkoutService = new CheckoutService(1);
        $this->transactionService = new TransactionService;
        $this->voucherPurchaseService = new VoucherPurchaseService;
        $this->tripCardPaymentService = new TripCardPaymentService;
    }

    /**
     * @throws Exception
     */
    public function handle(): void
    {
        $transactionsInProcess = $this->transactionService->getInProcessPayments();

        foreach ($transactionsInProcess as $transaction) {
            $payment = $this->checkoutService
                ->findIntermediaryPayment($transaction->generatedPaymentId);

            if ($payment['status'] != CheckoutStatusConst::IN_PROCESS)
                $this->syncTransaction($transaction, $payment);
        }
    }

    /**
     * @param $transaction
     * @param $payment
     * @return stdClass
     * @throws Exception
     */
    public function syncTransaction($transaction, $payment)
    {
        echo "sincronizando transação: " . $transaction->idTransaction . PHP_EOL;

        if ($payment['status'] == TransactionConst::APPROVED) {
            echo "      transação " . $transaction->idTransaction . " estornada " . PHP_EOL;
            return $this->cancelPayment($transaction);
        }

        return $this->updatePayment($transaction, $payment);
    }

    /**
     * @param $transaction
     * @param $payment
     * @return stdClass
     * @throws Exception
     */
    public function updatePayment($transaction, $payment)
    {
        $transactionObj = new Transaction($transaction);
        $transactionObj
            ->setTransactionStatusId(
                $this->transactionService
                    ->returnStatusId($payment['status']))
            ->setStatusDetailed($payment['status_detail'])
            ->setStatus($payment['status'])
            ->setIntermediaryFee(
                $payment['fee_details'][0]->amount ?? 0
            );

        $this->transactionService
            ->update($transactionObj);

        $transaction->status = $transactionObj->getStatus();
        $transaction->status_detailed = $transactionObj->getStatusDetailed();

        $this->updateStatusPayment($transaction);

        $this->createTransactionLog($transactionObj, $payment);

        return $transactionObj->toStdClass();
    }

    /**
     * @param $transaction
     * @return stdClass
     * @throws Exception
     */
    private function cancelPayment($transaction)
    {
        $this->checkoutService->refundPayment(new Transaction($transaction));

        $payment = $this->checkoutService
            ->findIntermediaryPayment($transaction->generatedPaymentId);

        $transactionObj = new Transaction($transaction);
        $transactionObj
            ->setTransactionStatusId(
                $this->transactionService
                    ->returnStatusId($payment['status']))
            ->setStatusDetailed($payment['status_detail'])
            ->setStatus($payment['status'])
            ->setIntermediaryFee(
                $payment['fee_details'][0]->amount ?? 0
            );

        $this->transactionService
            ->update($transactionObj);

        $transaction->status = $transactionObj->getStatus();
        $transaction->status_detailed = $transactionObj->getStatusDetailed();

        $this->updateStatusPayment($transaction);

        return $transactionObj->toStdClass();
    }

    /**
     * @param $transaction
     * @return stdClass
     * @throws Exception
     */
    private function updateStatusPayment($transaction)
    {
        if ($transaction->idVoucherPurchase) {
            return $this->voucherPurchaseService->updateByTransaction(
                $transaction->idVoucherPurchase,
                new Transaction($transaction)
            )->toStdClass();
        }

        return $this->tripCardPaymentService
            ->updateTripCardPayment(new Transaction($transaction))
            ->toStdClass();
    }

    /**
     * @param Transaction $transaction
     * @param null $paymentData
     */
    private function createTransactionLog(Transaction $transaction, $paymentData = null): void
    {
        $log = new TransactionLog;
        $log
            ->setUserId($transaction->getUserId())
            ->setIdReference($transaction->getIdTransaction())
            ->setData((object)[
                'transaction' => $transaction->toStdClass(),
                'paymentData' => $paymentData
            ]);

        (new TransactionLogDao)->noSqlInsert($log->toStdClass());
    }

}