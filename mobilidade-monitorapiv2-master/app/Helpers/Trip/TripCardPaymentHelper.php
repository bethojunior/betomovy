<?php

namespace App\Helpers\Trip;

use App\Constants\Transaction\TransactionConst;
use App\Constants\Trip\PaymentFormTypeConst;
use App\Constants\Trip\TripCardPaymentConst;
use App\Exceptions\Checkout\CheckoutException;
use App\Helpers\Checkout\CheckoutHelper;
use App\Models\Trip\Trip;
use App\Repositories\Trip\TripCardPaymentRepository;
use App\Repositories\Trip\TripPaymentFormRepository;
use App\Utils\Pay704\Exceptions\NoResponseFromServerException;
use App\Utils\Pay704\Exceptions\Pay704Exception;
use App\Utils\Pay704\Exceptions\ServerErrorException;

class TripCardPaymentHelper
{
    private TripCardPaymentRepository $tripCardPaymentRepository;
    private TripPaymentFormRepository $tripPaymentFormRepository;
    private CheckoutHelper $checkoutHelper;

    public function __construct(
        TripCardPaymentRepository $tripCardPaymentRepository,
        TripPaymentFormRepository $tripPaymentFormRepository,
        CheckoutHelper $checkoutHelper
    )
    {
        $this->tripCardPaymentRepository = $tripCardPaymentRepository;
        $this->tripPaymentFormRepository = $tripPaymentFormRepository;
        $this->checkoutHelper = $checkoutHelper;
    }

    /**
     * @throws CheckoutException
     * @throws ServerErrorException
     * @throws Pay704Exception
     * @throws NoResponseFromServerException
     */
    public function capturePaymentIfNeeded(Trip $trip): bool
    {
        $tripPaymentForm = $this->tripPaymentFormRepository->findById($trip->tripPaymentFormId);

        if ($tripPaymentForm->paymentFormTypeId != PaymentFormTypeConst::CREDIT_CARD) {
            return false;
        }

        $tripCardPayment = $this->tripCardPaymentRepository->findByTrip($trip->tripReference);

        if (in_array(
                $tripCardPayment->captured,
                [TripCardPaymentConst::TO_CAPTURE, TripCardPaymentConst::NOT_CAPTURED] // @TODO: Remove TO_CAPTURE in future versions
            )) {
            $transaction = $this->checkoutHelper->captureAmount($tripCardPayment->transaction);

            $tripCardPayment->captured = $transaction->transactionStatusId == TransactionConst::APPROVED;
            $tripCardPayment->status = $transaction->status;
            $tripCardPayment->status_detail = $transaction->status_detailed;
            $tripCardPayment->save();
        }

        return true;
    }
}
