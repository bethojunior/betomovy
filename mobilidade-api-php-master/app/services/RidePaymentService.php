<?php

namespace app\services;

use app\constant\CompanyBalanceConst;
use app\constant\CustomerBalanceConst;
use app\constant\PaymentFormTypeConst;
use app\dao\BalanceDao;
use app\dao\BalanceFlowDao;
use app\dao\CompanyWorkerDao;
use app\dao\CustomerDao;
use app\dao\RideDao;
use app\dao\TripPaymentFormDao;
use app\exceptions\CardException;
use app\exceptions\CheckoutCardException;
use app\exceptions\CheckoutServiceException;
use app\exceptions\TransactionException;
use app\exceptions\TripPaymentException;
use app\validator\CheckoutCardValidator;
use app\model\Config;
use Exception;
use app\model\Ride;
use app\model\Rider;
use app\model\TripCardPayment;
use stdClass;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 07/01/2020
 * Time: 15:07
 */
class RidePaymentService
{
    /**
     * @var TripPaymentFormDao
     */
    private $tripPaymentFormDao;
    /**
     * @var CustomerDao
     */
    private $customerDao;
    /**
     * @var RideDao
     */
    private $rideDao;
    /**
     * @var RideCardPaymentService
     */
    private $rideCardPaymentService;
    /**
     * @var CheckoutCardValidator
     */
    private $responseValidator;
    /**
     * @var CompanyWorkerDao
     */
    private $companyWorkerDao;

    public function __construct()
    {
        $this->tripPaymentFormDao = new TripPaymentFormDao;
        $this->customerDao = new CustomerDao;
        $this->rideDao = new RideDao;
        $this->rideCardPaymentService = new RideCardPaymentService;
        $this->responseValidator = new CheckoutCardValidator;
        $this->companyWorkerDao = new CompanyWorkerDao;
    }

    /**
     * @param \app\model\Rider $rider
     * @param null $cardId
     * @param null $mpToken
     * @throws CardException
     * @throws CheckoutCardException
     * @throws CheckoutServiceException
     * @throws TripPaymentException
     * @throws Exception
     */
    public function ridePayment(Rider $rider, $cardId = null, $mpToken = null): void
    {
        $tripPaymentForm = $this->tripPaymentFormDao
            ->find($rider->getTripPaymentFormId());

        $customer = $this->customerDao
            ->findByUser($rider->getUserId());

        switch (((int)$tripPaymentForm->paymentFormTypeId)) {
            case PaymentFormTypeConst::VOUCHER:
                $this->voucherPayment($customer, $rider);
                break;
            case PaymentFormTypeConst::VOUCHER_ADMINISTRATIVE:
                $this->voucherAdministrativePayment($rider);
                break;
            case PaymentFormTypeConst::CREDIT_CARD:
                if (!$cardId) {
                    $customerCards = (new \app\dao\CustomerCardDao())->findByUserId($rider->getUserId());
                    if (!empty($customerCards) && isset($customerCards[0]['idCard'])) {
                        $cardId = $customerCards[0]['idCard'];
                    }
                }

                if (!$cardId)
                    throw new TripPaymentException(251);

                $this->creditCardPayment($rider, $cardId, $mpToken);
                break;
        }
    }

    /**
     * @param \app\model\Rider $rider
     * @return void
     * @throws CheckoutServiceException
     * @throws TransactionException
     * @throws TripPaymentException
     * @throws Exception
     */
    public function ridePaymentOnCancel(Rider $rider): void
    {
        $tripPaymentForm = $this->tripPaymentFormDao
            ->find($rider->getTripPaymentFormId());

        switch (((int)$tripPaymentForm->paymentFormTypeId)) {
            case PaymentFormTypeConst::VOUCHER:
                $this->cancelPaymentByVoucher($rider);
                break;

            case PaymentFormTypeConst::VOUCHER_ADMINISTRATIVE:
                $this->cancelPaymentByVoucher($rider, true);
                break;

            case PaymentFormTypeConst::CREDIT_CARD:
                $this->cancelPaymentByCreditCardPayment($rider);
                break;
        }
    }

    /**
     * @param stdClass $customer
     * @param \app\model\Rider $rider
     * @throws Exception
     */
    private function voucherPayment(stdClass $customer, Rider $rider): void
    {
        $totalBalance = (float)($customer->tripBalance ?? 0) + (float)($customer->balance ?? 0);
        if ($totalBalance < (float)$rider->getValue()) {
            throw new Exception("Cliente não possui saldo suficiente");
        }

        $ride = $this->rideDao
            ->find($rider->getRideId());

        $this->withheldVoucherBalance(
            $customer->balanceId, $rider->getValue(), $ride->tripReference);
    }

    /**
     * @param \app\model\Rider $rider
     * @throws Exception
     */
    private function voucherAdministrativePayment(Rider $rider): void
    {
        $worker = $this->companyWorkerDao
            ->findWithCompany($rider->getUserId());

        if (!$worker)
            throw new Exception("Esse tipo de pagamento não está habilitado para você");

        if ($worker->tripBalance < $rider->getValue())
            throw new Exception("Empresa não possui saldo suficiente");

        $ride = $this->rideDao
            ->find($rider->getRideId());

        $this->withheldVoucherBalance(
            $worker->balanceId, $rider->getValue(), $ride->tripReference, true);
    }

    /**
     * @param \app\model\Rider $rider
     * @param $cardId
     * @param $mpToken
     * @return void
     * @throws CardException
     * @throws CheckoutCardException
     * @throws CheckoutServiceException
     */
    private function creditCardPayment(Rider $rider, $cardId, $mpToken): void
    {
        $ride = $this->rideDao
            ->find($rider->getRideId());

        $description = $this->mountDescription(new Ride($ride));

        $payment = $this->rideCardPaymentService
            ->initPayment(new Ride($ride), $rider, $cardId, $description, $mpToken);

        $this->throwRejectedPayment($payment, $description);
    }

    /**
     * @param \app\model\Rider $rider
     * @param bool $isAdministrative
     * @throws Exception
     */
    private function cancelPaymentByVoucher(Rider $rider, $isAdministrative = false)
    {
        $customer = !$isAdministrative ?
            $this->customerDao->findByUser($rider->getUserId()) :
            $this->companyWorkerDao
                ->findWithCompany($rider->getUserId());

        $ride = $this->rideDao
            ->find($rider->getRideId());

        $this->refundVoucherBalanceOnCancel(
            $customer->balanceId, $rider->getValue(), $ride->tripReference, $isAdministrative);
    }

    /**
     * @param $balanceId
     * @param $value
     * @param $tripReference
     * @param bool $isAdministrative
     * @throws Exception
     */
    private function withheldVoucherBalance($balanceId, $value, $tripReference, $isAdministrative = false)
    {
        (new BalanceDao)
            ->update(
                $balanceId,
                $value,
                ['tripBalance', 'withheldBalance'],
                ['-', '+']);

        (new BalanceFlowDao)
            ->insert(
                $value,
                !$isAdministrative ?
                    CustomerBalanceConst::TRIP_BALANCE_LOCKOUT : CompanyBalanceConst::TRIP_BALANCE_OUT,
                $balanceId,
                $tripReference);
    }

    /**
     * @param $balanceId
     * @param $value
     * @param $tripReference
     * @param bool $isAdministrative
     * @throws Exception
     */
    private function refundVoucherBalanceOnCancel($balanceId, $value, $tripReference, $isAdministrative = false)
    {
        (new BalanceDao)
            ->update(
                $balanceId,
                $value,
                ['tripBalance', 'withheldBalance'],
                ['+', '-']);

        (new BalanceFlowDao)
            ->insert(
                $value,
                !$isAdministrative ?
                    CustomerBalanceConst::RETURN_TRIP_BALANCE_CANCELLATION :
                    CompanyBalanceConst::VOUCHER_RETURN_UNFINISHED_TRIP,
                $balanceId,
                $tripReference);
    }

    /**
     * @param \app\model\Rider $rider
     * @throws CheckoutServiceException
     * @throws TransactionException
     * @throws TripPaymentException
     */
    private function cancelPaymentByCreditCardPayment(Rider $rider)
    {
        $ride = $this->rideDao->find($rider->getRideId());

        $this->rideCardPaymentService->cancelPayment(new Ride($ride));
    }

    /**
     * @param \app\model\Ride $ride
     * @return string
     */
    private function mountDescription(Ride $ride): string
    {
        $appName = Config::get('app_title');

        return "CARONA {$appName} - {$ride->getTripReference()}";
    }

    /**
     * @param $status
     * @param $statusDetailed
     * @param $description
     * @throws CheckoutCardException
     * @throws CheckoutServiceException
     */
    private function throwRejectedPayment(TripCardPayment $payment, ?string $description = null): void
    {
        $this->responseValidator->validateTransactionResponse(
            $payment->getStatus(),
            $payment->getStatusDetail(),
            $description,
            $payment->getIntermediaryId()
        );
    }
}