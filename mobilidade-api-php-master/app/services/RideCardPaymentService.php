<?php

namespace app\services;

use app\dao\TripCardPaymentDao;
use app\exceptions\CardException;
use app\exceptions\CheckoutServiceException;
use app\exceptions\TransactionException;
use app\exceptions\TripPaymentException;
use app\utils\Headers;
use Exception;
use app\model\Ride;
use app\model\Rider;
use app\model\Transaction;
use app\model\TripCardPayment;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 07/01/2020
 * Time: 17:01
 */
class RideCardPaymentService
{
    private $dao;
    private $checkoutService;
    /** @var TripCardPayment $tripCardPayment */
    private $tripCardPayment;
    /** @var \app\model\Rider $rider */
    private $rider;
    private $transactionService;
    /**
     * @var Ride
     */
    private $ride;

    public function __construct()
    {
        $this->dao = new TripCardPaymentDao;
        $this->transactionService = new TransactionService;
        $this->checkoutService = new CheckoutService;
    }

    /**
     * @param Ride $ride
     * @param \app\model\Rider $rider
     * @param $cardId
     * @param string $description
     * @param $mpToken
     * @return TripCardPayment
     * @throws CheckoutServiceException
     * @throws CardException
     */
    public function initPayment(Ride $ride, Rider $rider, $cardId, string $description, $mpToken): TripCardPayment
    {
        $this->rider = $rider;
        $this->ride = $ride;

        $paymentTransaction = $this->checkoutService
            ->doCardCreditPayment(
                $rider->getValue(),
                $cardId,
                $ride->getTripReference(),
                $description,
                $mpToken);

        return $this->mountTripCardPayment($paymentTransaction, $cardId, true);
    }

    /**
     * @param Ride $ride
     * @return TripCardPayment
     * @throws TransactionException
     * @throws TripPaymentException
     * @throws CheckoutServiceException
     * @throws Exception
     */
    public function cancelPayment(Ride $ride)
    {
        $this->tripCardPayment = $this->findByTrip($ride->getTripReference());

        $transaction = $this->transactionService
            ->find($this->tripCardPayment->getTransactionId());

        $transaction = $this->checkoutService
            ->refundPayment($transaction);

        $this->updateTripCardPayment($transaction);

        return $this->tripCardPayment;
    }

    /**
     * @param Transaction $transaction
     * @param bool $capture
     * @return TripCardPayment
     * @throws Exception
     */
    public function updateTripCardPayment(Transaction $transaction, $capture = false): TripCardPayment
    {
        if (!$this->tripCardPayment)
            $this->tripCardPayment = new TripCardPayment(
                $this->dao->findByTransaction($transaction->getIdTransaction())
            );

        $this->tripCardPayment
            ->setCaptured($capture)
            ->setStatus($transaction->getStatus())
            ->setStatusDetail($transaction->getStatusDetailed());

        $this->update($this->tripCardPayment);

        return clone $this->tripCardPayment;
    }

    /**
     * @param Transaction $transaction
     * @param $cardId
     * @param bool $capture
     * @return TripCardPayment
     */
    private function mountTripCardPayment(Transaction $transaction, $cardId, $capture = false): TripCardPayment
    {
        $this->tripCardPayment = new TripCardPayment;
        $this->tripCardPayment
            ->setCardId($cardId)
            ->setUserId(Headers::getUserId())
            ->setTransactionId($transaction->getIdTransaction())
            ->setIntermediaryId($transaction->getIntermediaryId())
            ->setCaptured($capture)
            ->setStatus($transaction->getStatus())
            ->setStatusDetail($transaction->getStatusDetailed())
            ->setAmount($transaction->getValue())
            ->setTripReference($this->ride->getTripReference())
            ->setIdTripCardPayment(
                $this->dao
                    ->sqlInsert($this->tripCardPayment)
            );

        return clone $this->tripCardPayment;
    }

    /**
     * @param string $tripReference
     * @return \app\model\TripCardPayment
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
     * @param \app\model\TripCardPayment $tripCardPayment
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