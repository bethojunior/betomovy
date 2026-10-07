<?php

namespace app\services;

use app\constant\PaymentFormTypeConst;
use app\exceptions\CardException;
use app\exceptions\CheckoutCardException;
use app\exceptions\CheckoutServiceException;
use app\utils\Headers;
use app\validator\CheckoutCardValidator;
use app\model\Config;
use Exception;
use app\model\Transaction;
use app\model\Trip;
use app\model\TripCancellationCustomerFee;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/04/2019
 * Time: 14:35
 */
class DiscountCancellationCustomerFeeService
{
    private $checkoutService;
    private $tripCancellationCustomerFeeService;
    private $responseValidator;

    public function __construct()
    {
        $this->tripCancellationCustomerFeeService = new TripCancellationCustomerFeeService;
        $this->checkoutService = new CheckoutService;
        $this->responseValidator = new CheckoutCardValidator;
    }

    /**
     * @param \app\model\TripCancellationCustomerFee $cancellationCustomerFee
     * @param $cardId
     * @param Trip $trip
     * @param int $tripPaymentFormTypeId
     * @return bool
     * @throws CardException
     * @throws Exception
     */
    public function discountByCreditCard(
        TripCancellationCustomerFee $cancellationCustomerFee,
                                    $cardId,
        Trip                        $trip,
        int                         $tripPaymentFormTypeId)
    {
        try {

            if ($tripPaymentFormTypeId == PaymentFormTypeConst::CREDIT_CARD)
                $paymentTransaction = $this->checkoutService
                    ->doCardCreditPayment(
                        $cancellationCustomerFee->getFeeValue(),
                        $cardId,
                        null,
                        $this->mountDescription(),
                        Headers::getMpToken(),
                        $trip->getCityId()
                    );
            else
                $paymentTransaction = $this->checkoutService
                    ->doCardDebitPayment(
                        $cancellationCustomerFee->getFeeValue(),
                        $cardId,
                        null,
                        $this->mountDescription(),
                        Headers::getMpToken()
                    );

            $this->throwRejectedPayment($paymentTransaction,
                $this->mountDescription() . "({$trip->getTripReference()})");

            return $this->tripCancellationCustomerFeeService
                ->putToScheduledTransfer($cancellationCustomerFee, $trip, $paymentTransaction);

        } catch (CheckoutCardException $e) {
            return false;
        } catch (CheckoutServiceException $e) {
            return false;
        }
    }

    /**
     * @return string
     */
    private function mountDescription()
    {
        return 'TAXA DE CANCELAMENTO - ' . Config::get('app_title');
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