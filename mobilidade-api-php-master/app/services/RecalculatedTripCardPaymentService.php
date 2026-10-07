<?php

namespace app\services;

use app\dao\TransactionDao;
use app\dao\TripCardPaymentDao;
use app\exceptions\CheckoutCardException;
use app\constant\FinancialIntermediaryConst;
use app\exceptions\CheckoutServiceException;
use app\utils\Headers;
use app\validator\CheckoutCardValidator;
use app\services\TripCardPaymentService;
use app\model\Config;
use Exception;
use app\model\RecalculatedTrip;
use app\model\Transaction;
use app\model\Trip;
use app\model\TripCardPayment;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 19/11/2019
 * Time: 16:30
 */
class RecalculatedTripCardPaymentService
{
    private $checkoutService;
    private $tripCardPaymentService;
    private $tripCardPayment;
    private $responseValidator;
    private $tripCardPaymentDao;
    private $amount;
    private $transactionDao;

    /**
     * RecalculatedTripCardPaymentService constructor.
     * @throws CheckoutServiceException
     */
    public function __construct()
    {
        $this->checkoutService = new CheckoutService;
        $this->tripCardPaymentService = new TripCardPaymentService;
        $this->responseValidator = new CheckoutCardValidator;
        $this->tripCardPaymentDao = new TripCardPaymentDao;
        $this->transactionDao = new TransactionDao();
    }

    /**
     * @param RecalculatedTrip $recalculatedTrip
     * @param \app\model\Trip $trip
     * @return bool
     * @throws Exception
     */
    public function discountByCreditCard(RecalculatedTrip $recalculatedTrip, Trip $trip)
    {
        try {
            $tripCardPayment = $this->findTripCardPayment($trip->getTripReference());

            $transaction = $this->fiandTransaction($tripCardPayment->getTransactionId());

            $this->amount = ($recalculatedTrip->getNewPrice() - $recalculatedTrip->getOldPrice());

            if ($transaction->getIntermediaryId() == FinancialIntermediaryConst::PAY704) {
                $this->amount = $recalculatedTrip->getNewPrice();
            }

            $paymentTransaction = $this->checkoutService
                ->doCardCreditPayment(
                    $this->amount,
                    $tripCardPayment->getCardId(),
                    $this->mountDescription(),
                    Headers::getMpToken(),
                    null,
                    $trip->getCityId()
                );

            $this->throwRejectedPayment($paymentTransaction,
                $this->mountDescription() . "({$trip->getTripReference()})");
            
            if ($paymentTransaction->getIntermediaryId() == FinancialIntermediaryConst::PAY704) {
                $transaction = $this->checkoutService
                    ->refundPayment($transaction, $trip->getCityId());

                $this->tripCardPaymentService->updateRecalculatedTripCardPayment($paymentTransaction, $trip, true);
                return true;

            }

            return true;

        } catch (CheckoutCardException $e) {
            return false;
        } catch (CheckoutServiceException $e) {
            return false;
        }
    }

    /**
     * @param \app\model\RecalculatedTrip $recalculatedTrip
     * @param \app\model\Trip $trip
     * @return bool
     */
    public function discountByDebitCard(RecalculatedTrip $recalculatedTrip, Trip $trip)
    {
        try {
            $tripCardPayment = $this->findTripCardPayment($trip->getTripReference());

            $paymentTransaction = $this->checkoutService
                ->doCardDebitPayment(
                    ($recalculatedTrip->getNewPrice() - $recalculatedTrip->getOldPrice()),
                    $tripCardPayment->getCardId(),
                    null,
                    $this->mountDescription(),
                    Headers::getMpToken()
                );

            $this->throwRejectedPayment($paymentTransaction,
                $this->mountDescription() . "({$trip->getTripReference()})");

            return true;

        } catch (CheckoutCardException $e) {
            return false;
        } catch (CheckoutServiceException $e) {
            return false;
        }
    }

    private function findTripCardPayment($tripReference)
    {
        $tripCardPayment = $this->tripCardPaymentDao
            ->findByTrip($tripReference);

        return new TripCardPayment($tripCardPayment);
    }

    private function fiandTransaction($transactionId)
    {
        $transaction = $this->transactionDao
            ->find($transactionId);

        return new Transaction($transaction);
    }

    /**
     * @return string
     */
    private function mountDescription()
    {
        return 'RECÁLCULO DE VIAGEM - ' . Config::get('app_title');
    }

    /**
     * @param \app\model\Transaction $transaction
     * @param null|string $description
     * @throws CheckoutCardException
     */
    private function throwRejectedPayment(Transaction $transaction, ?string $description = null): void
    {
        $this->responseValidator->validateTransactionResponse(
            $transaction->getStatus(),
            $transaction->getStatusDetailed(),
            $description,
            $transaction->getIntermediaryId()
        );
    }
}