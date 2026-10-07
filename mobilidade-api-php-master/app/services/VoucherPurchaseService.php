<?php

namespace app\services;

use app\constant\TransactionTypeConst;
use app\dao\CustomerDao;
use app\dao\LogDao;
use app\dao\VoucherPurchaseDao;
use app\exceptions\CheckoutCardException;
use app\exceptions\CheckoutServiceException;
use app\exceptions\VoucherPurchaseException;
use app\utils\Connection;
use app\utils\Headers;
use app\validator\CheckoutCardValidator;
use app\validator\VoucherPurchaseValidator;
use app\model\Config;
use Exception;
use app\model\PaymentForm;
use PDO;
use app\model\Transaction;
use app\model\VoucherPurchase;
use Carbon\Carbon;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/12/2018
 * Time: 17:25
 */
class VoucherPurchaseService
{
    /** @var PDO $conn */
    private $conn;
    private $validator;
    private $checkoutService;
    private $customerDao;
    private $dao;
    private $customer;
    private $responseValidator;

    /** @var \app\model\Transaction $transaction */
    private $transaction;
    /** @var VoucherPurchase $voucherPurchase */
    private $voucherPurchase;

    /**
     * VoucherPurchaseService constructor.
     */
    public function __construct()
    {
        $this->conn = Connection::open();
        $this->dao = new VoucherPurchaseDao;
        $this->validator = new VoucherPurchaseValidator;
        $this->checkoutService = new CheckoutService;
        $this->customerDao = new CustomerDao;
        $this->responseValidator = new CheckoutCardValidator;
    }

    /**
     * @param $request
     * @return array
     * @throws Exception
     */
    public function insertInCustomer($request)
    {
        $this->validator->validateInsertVoucher($request);

        try {
            $this->conn->beginTransaction();

            $this->customer = $this->customerDao
                ->findByUser(Headers::getUserId());

            $saleDescription = (Config::get('app_title') ?? '') . ' - COMPRA DE VOUCHER - ' . date('Y-m-d H:i:s');

            $this->choicePayment($request, $saleDescription);

            $this->mountVoucherPurchase($request->amount, $request->cardId);

            $result = $this->insertTripBalanceOnCustomer();

            $this->conn->commit();

            if (!$result)
                $this->throwRejectedPayment($saleDescription);

            return [
                'balance' => $result,
                'status' => $this->transaction->getStatus(),
                'payment_data' => [
                    'code' => $this->transaction->getPaymentCode()
                ],
                'voucher' => [
                    'voucher_id' => $this->voucherPurchase->getIdVoucherPurchase(),
                ]
            ];
        } catch (Exception $e) {
            if ($this->conn->inTransaction())
                $this->conn->rollBack();

            (new LogDao)->logException($e);
            throw $e;
        }
    }

    /**
     * @param $voucherPaymentId
     * @param Transaction $transaction
     * @return VoucherPurchase
     * @throws Exception
     */
    public function updateByTransaction($voucherPaymentId, Transaction $transaction)
    {
        $voucherPurchase = new VoucherPurchase(
            $this->dao->find($voucherPaymentId)
        );
        $voucherPurchase
            ->setStatus($transaction->getStatus())
            ->setStatusDetail($transaction->getStatusDetailed());

        return $this->update($voucherPurchase);
    }

    /**
     * @param VoucherPurchase $voucherPurchase
     * @return VoucherPurchase
     * @throws Exception
     */
    private function update(VoucherPurchase $voucherPurchase): VoucherPurchase
    {
        $set = [];
        $bind = [];

        foreach ($voucherPurchase->extract() as $key => $value) {
            if ($value) {
                if ($key != 'idVoucherPurchase')
                    $set[$key] = ":$key";

                $bind[":$key"] = $value;
            }
        }

        $this->dao
            ->sqlUpdate($set, [['idVoucherPurchase', '=', ':idVoucherPurchase']], $bind);

        return $voucherPurchase;
    }

    /**
     * @param $voucherPaymentId
     * @return VoucherPurchase
     * @throws Exception
     */
    public function getVoucherDetail($voucherPaymentId): array
    {
        if (!$voucherPaymentId)
            throw new VoucherPurchaseException(1056);

        $voucherPurchase = new VoucherPurchase(
            $this->dao->find($voucherPaymentId)
        );

        if (!$voucherPurchase->getIdVoucherPurchase())
            throw new VoucherPurchaseException(1055);

        return [
            'status_detail' => $voucherPurchase->getStatusDetail(),
            'amount' => $voucherPurchase->getAmount(),
            'value' => $voucherPurchase->getValue(),
            'status' => $voucherPurchase->getStatus(),
            'transactionId' => $voucherPurchase->getTransactionId(),
        ];
    }

    /**
     * @param $amount
     * @param null $cardId
     * @return VoucherPurchase
     */
    private function mountVoucherPurchase($amount, $cardId = null): VoucherPurchase
    {
        $this->voucherPurchase = new VoucherPurchase;
        $this->voucherPurchase
            ->setUserId(Headers::getUserId())
            ->setStatus($this->transaction->getStatus())
            ->setStatusDetail($this->transaction->getStatusDetailed())
            ->setAmount($amount)
            ->setValue($this->transaction->getValue())
            ->setCaptured(true)
            ->setCapturedAmount($amount)
            ->setTransactionId($this->transaction->getIdTransaction())
            ->setCardId($cardId)
            ->setIdVoucherPurchase(
                (new VoucherPurchaseDao)
                    ->sqlInsert($this->voucherPurchase)
            );

        return clone $this->voucherPurchase;
    }

    /**
     * @param $request
     * @param $saleDescription
     * @throws VoucherPurchaseException
     * @throws Exception
     */
    private function choicePayment($request, $saleDescription)
    {
        switch ($request->paymentFormId) {
            case PaymentForm::CREDIT_CARD:
                $this->creditCardPayment($request->cardId, $request->value, $saleDescription, $request->mpToken);
                break;
            case PaymentForm::DEBIT_CARD:
                $this->debitCardPayment($request->cardId, $request->value, $saleDescription, $request->mpToken);
                break;
            case PaymentForm::PIX:
                $this->pixPayment($request->value);
                break;
            default:
                throw new VoucherPurchaseException(1050);
        }
    }

    private function pixPayment($value)
    {
        [$transaction, $payment] = $this->checkoutService
            ->pixPayment(
                [
                    'amount' => (float) $value * 100,
                    'dueDate' => Carbon::now()->addMinutes(10),
                    'customer' => [
                        'name' => $this->customer->name,
                        'documentNumber' => $this->customer->document,
                        'email' => $this->customer->email,
                    ],
                ],
                TransactionTypeConst::VOUCHER
            );

        $this->transaction = $transaction;
    }

    /**
     * @param $cardId
     * @param $value
     * @param $saleDescription
     * @param $mpToken
     * @throws Exception
     */
    private function creditCardPayment($cardId, $value, $saleDescription, $mpToken)
    {
        $this->transaction = $this->checkoutService
            ->doCardCreditPayment(
                $value,
                $cardId,
                null,
                $saleDescription,
                $mpToken);
    }

    /**
     * @param $cardId
     * @param $value
     * @param $saleDescription
     * @param $mpToken
     * @throws CheckoutServiceException
     */
    private function debitCardPayment($cardId, $value, $saleDescription, $mpToken)
    {
        $this->transaction = $this->checkoutService
            ->doCardDebitPayment(
                $value,
                $cardId,
                null,
                $saleDescription,
                $mpToken);
    }

    /**
     * @return bool
     * @throws Exception
     */
    private function insertTripBalanceOnCustomer()
    {
        $customerVoucherPurchaseService = new CustomerVoucherPurchaseService;
        $result = $customerVoucherPurchaseService
            ->manageTripBalance(
                $this->transaction,
                $this->voucherPurchase,
                $this->customer->balanceId
            );

        return $result;
    }

    /**
     * @param $saleDescription
     * @throws CheckoutCardException
     * @throws CheckoutServiceException
     */
    private function throwRejectedPayment($saleDescription): void
    {
        $this->responseValidator->validateTransactionResponse(
            $this->transaction->getStatus(),
            $this->transaction->getStatusDetailed(),
            $saleDescription,
            $this->transaction->getIntermediaryId()
        );
    }

    /**
     * @param $voucherPaymentId
     * @param Transaction $transaction
     * @return VoucherPurchase
     * @throws Exception
     */
    public function getVoucherPurchaseByTransaction($transaction)
    {
        $voucherPurchase = $this->dao->findByField('transactionId', $transaction->getIdTransaction());

        return $voucherPurchase;
    }
}