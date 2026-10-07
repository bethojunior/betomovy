<?php

namespace app\services;

use app\constant\PaymentFormTypeConst;
use app\dao\CentralDao;
use app\dao\CompanyWorkerDao;
use app\dao\CustomerBalanceDao;
use app\dao\TripPaymentFormDao;
use app\model\Driver;
use app\model\TripAudit;
use app\services\payment\split\SaveDriverSplitValueService;
use Exception;
use app\model\Trip;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 27/12/2018
 * Time: 16:38
 */
class CustomerSplitTripPaymentService
{
    private $customerBalanceDao;
    private $tripCancellationFeeBalanceService;
    /**
     * @var CompanyWorkerDao
     */
    private $companyWorkerDao;

    /**
     * @var CentralDao
     */
    private $centralDao;

    public function __construct()
    {
        $this->customerBalanceDao = new CustomerBalanceDao;
        $this->tripCancellationFeeBalanceService = new TripCancellationFeeBalanceService;
        $this->companyWorkerDao = new CompanyWorkerDao;
        $this->centralDao = new CentralDao();
    }

    /**
     * @param Trip $trip
     * @param $customerBalanceId
     * @param Driver $driver
     * @param int $paymentFormTypeId
     * @return array
     * @throws Exception
     */
    public function splitTripPayment(Trip $trip, $customerBalanceId, Driver $driver, int $paymentFormTypeId): array
    {
        $customerBalance = null;

        switch ($paymentFormTypeId) {
            case PaymentFormTypeConst::VOUCHER:
                $customerBalance = $this->customerBalanceDao
                    ->subBalanceAfterFinishTrip($customerBalanceId, $trip);
                break;

            case PaymentFormTypeConst::VOUCHER_CENTRAL:
                $worker = $this->centralDao
                    ->find($trip->getUserId());

                $customerBalance = $this->customerBalanceDao
                    ->subBalanceAfterFinishTrip($worker->balanceId, $trip, true);
                break;

            case PaymentFormTypeConst::VOUCHER_ADMINISTRATIVE:
                $worker = $this->companyWorkerDao
                    ->findWithCompany($trip->getUserId());

                $customerBalance = $this->customerBalanceDao
                    ->subBalanceAfterFinishTrip($worker->balanceId, $trip, true);
        }

        $cancellationFee = $this->tripCancellationFeeBalanceService
            ->manageFee($trip, $driver->getBalanceId());

        (new TripTaxService())->manageTaxes($trip, $driver->getBalanceId(), $paymentFormTypeId);

        $driverBalance = (new DriverBalanceService)
            ->setTripCancellationFee($cancellationFee)
            ->addBalanceOnCustomerTrip($driver, $trip, $paymentFormTypeId);

        return array_merge(compact('customerBalance'), $driverBalance);
    }

}