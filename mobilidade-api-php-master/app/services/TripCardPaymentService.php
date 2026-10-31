<?php

namespace app\services;

use app\constant\PaymentFormTypeConst;
use app\constant\FinancialIntermediaryConst;
use app\constant\TransactionConst;
use app\constant\TransactionTypeConst;
use app\dao\CustomerCardDao;
use app\dao\TransactionDao;
use app\dao\TripCardPaymentDao;
use app\exceptions\CardException;
use app\exceptions\CheckoutServiceException;
use app\exceptions\TransactionException;
use app\exceptions\TripPaymentException;
use app\services\payment\split\DriverSplitPaymentService;
use app\utils\Headers;
use Exception;
use app\model\Transaction;
use app\model\Trip;
use app\model\TripCardPayment;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 26/12/2018
 * Time: 16:00
 */
class TripCardPaymentService
{
    private $dao;
    private $checkoutService;
    /** @var TripCardPayment $tripCardPayment */
    private $tripCardPayment;
    /** @var Trip $trip */
    private $trip;
    private $transactionService;

    public function __construct()
    {
        $this->dao = new TripCardPaymentDao;
        $this->transactionService = new TransactionService;
        $this->checkoutService = new CheckoutService;
    }

    /**
     * @param Trip $trip
     * @param $cardId
     * @param string $description
     * @param $mpToken
     * @param int $paymentFormTypeId
     * @return TripCardPayment
     * @throws CardException
     * @throws CheckoutServiceException
     */
    public function initPayment(
        Trip $trip, $cardId, string $description, $mpToken, int $paymentFormTypeId): TripCardPayment
    {
        $this->trip = $trip;

        if ($paymentFormTypeId == PaymentFormTypeConst::CREDIT_CARD)
            $paymentTransaction = $this->checkoutService
                ->doCardCreditPayment(
                    $trip->getPrice(),
                    $cardId,
                    $trip->getTripReference(),
                    $description,
                    $mpToken,
                    $trip->getCityId(),
                    false);
        else
            $paymentTransaction = $this->checkoutService
                ->doCardDebitPayment(
                    $trip->getPrice(),
                    $cardId,
                    $trip->getTripReference(),
                    $description,
                    $mpToken,
                    $trip->getCityId());

        return $this->mountTripCardPayment($paymentTransaction, $cardId, TripCardPayment::CAPTURADO);
    }

    /**
     * @param Trip $trip
     * @return TripCardPayment
     * @throws TransactionException
     * @throws TripPaymentException
     * @throws Exception
     */
    public function cancelPayment(Trip $trip): TripCardPayment
    {
        $this->tripCardPayment = $this->findByTrip($trip->getTripReference());

        $transaction = $this->transactionService->find($this->tripCardPayment->getTransactionId());

        $transaction = $this->checkoutService->refundPayment($transaction, $trip->getCityId());

        if ($transaction->getTypeId() !== TransactionTypeConst::TRIP) {
            $this->updateTripCardPayment($transaction, TripCardPayment::CAPTURE);
        }

        return $this->tripCardPayment;
    }

    /**
     * @param Trip $trip
     * @return TripCardPayment
     * @throws TransactionException
     * @throws TripPaymentException
     * @throws Exception
     */
    public function finishPayment(Trip $trip): TripCardPayment
    {
        $this->tripCardPayment = $this->findByTrip($trip->getTripReference());

        // aqui irá verificar se o motorista possui split e a plataforma tem split habilitado
        // se tiver, cancela o pagamento e faz um novo pagamento com o split
        // usando os valores da driverSplitValue
        $transaction = (new DriverSplitPaymentService())->payDriverIfSplitEnabled($trip, $this->tripCardPayment);

        $transaction = $transaction ?? $this->transactionService
            ->find($this->tripCardPayment->getTransactionId());

        if ($this->tripCardPayment->getCaptured() == TripCardPayment::CAPTURE) {
            $transaction = $this->checkoutService
                ->captureAmount($transaction);
        }

        $this->updateTripCardPayment($transaction, TripCardPayment::CAPTURADO);

        return $this->tripCardPayment;
    }

    /**
     * @param Transaction $transaction
     * @param $cardId
     * @param bool $capture
     * @return TripCardPayment
     */
    private function mountTripCardPayment(Transaction $transaction, $cardId, $captured = true): TripCardPayment
    {
        switch ($transaction->getIntermediaryId()) {
            case FinancialIntermediaryConst::PAY704:
            case FinancialIntermediaryConst::EPAG:
            case FinancialIntermediaryConst::YUMEPAY:
            case FinancialIntermediaryConst::FIREBANKING:
            case FinancialIntermediaryConst::STRIPE:
                $captured = TripCardPayment::CAPTURE;
                break;
            default:
        }

        $this->tripCardPayment = new TripCardPayment;
        $this->tripCardPayment
            ->setCardId($cardId)
            ->setUserId(Headers::getUserId())
            ->setTransactionId($transaction->getIdTransaction())
            ->setIntermediaryId($transaction->getIntermediaryId())
            ->setCaptured($captured)
            ->setStatus($transaction->getStatus())
            ->setStatusDetail($transaction->getStatusDetailed())
            ->setAmount($transaction->getValue())
            ->setTripReference($this->trip->getTripReference())
            ->setIdTripCardPayment(
                $this->dao
                    ->sqlInsert($this->tripCardPayment)
            );

        return clone $this->tripCardPayment;
    }

    /**
     * @param Transaction $transaction
     * @param bool $capture
     * @return TripCardPayment
     * @throws Exception
     */
    public function updateTripCardPayment(Transaction $transaction, bool $capture = false): TripCardPayment
    {
        if (!$this->tripCardPayment)
            $this->tripCardPayment = new TripCardPayment(
                $this->dao->findByTransaction($transaction->getIdTransaction())
            );

        $this->tripCardPayment
            ->setCaptured($capture)
            ->setTransactionId($transaction->getIdTransaction())
            ->setStatus($transaction->getStatus())
            ->setStatusDetail($transaction->getStatusDetailed());

        $this->update($this->tripCardPayment);

        return clone $this->tripCardPayment;
    }


        /**
     * @param Transaction $transaction
     * @param bool $capture
     * @return TripCardPayment
     * @throws Exception
     */
    public function updateRecalculatedTripCardPayment(Transaction $transaction, Trip $trip, $capture = false): TripCardPayment
    {
        if (!$this->tripCardPayment)
            $this->tripCardPayment = new TripCardPayment(
                $this->dao->findByTrip($trip->getTripReference())
            );
        
        $this->tripCardPayment
            ->setCaptured($capture)
            ->setStatus($transaction->getStatus())
            ->setTransactionId($transaction->getIdTransaction())
            ->setAmount($transaction->getValue())
            ->setStatusDetail($transaction->getStatusDetailed());

        $this->update($this->tripCardPayment);

        return clone $this->tripCardPayment;
    }


    /**
     * @param $cardId
     * @return array|mixed
     * @throws Exception
     */
    private function getCard($cardId)
    {
        $card = (new CustomerCardDao)
            ->find($cardId);

        if (!$card && Headers::getUserId()) {
            $userCards = (new CustomerCardDao)->findByUserId(Headers::getUserId());
            if (!empty($userCards) && isset($userCards[0]['idCard'])) {
                $card = (new CustomerCardDao)->find($userCards[0]['idCard']);
            }
        }

        if (!$card)
            throw new TripPaymentException(251);

        return $card;
    }

    /**
     * @param string $tripReference
     * @return TripCardPayment
     * @throws TripPaymentException
     */
    private function findByTrip(string $tripReference): TripCardPayment
    {
        $tripCardPayment = $this->dao
            ->findByTrip($tripReference);

        if (!$tripCardPayment)
            throw new TripPaymentException(253, ['sended' => $tripReference]);

        return new TripCardPayment($tripCardPayment);
    }

    /**
     * @param TripCardPayment $tripCardPayment
     * @return TripCardPayment
     * @throws Exception
     */
    private function update(TripCardPayment $tripCardPayment): TripCardPayment
    {
        $set = [];
        $bind = [];

        foreach ($tripCardPayment->extract() as $key => $value) {
            if ($value) {
                if ($key != 'idTripCardPayment')
                    $set[$key] = ":$key";

                $bind[":$key"] = $value;
            }
        }

        $this->dao
            ->sqlUpdate($set, [['idTripCardPayment', '=', ':idTripCardPayment']], $bind);

        return $tripCardPayment;
    }
}