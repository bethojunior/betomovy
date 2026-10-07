<?php

namespace app\services;

use app\constant\DriverBalanceConst;
use app\dao\BalanceFlowDao;
use app\dao\DriverBalanceDao;
use app\dao\DriverDao;
use app\dao\TripCancellationCustomerFeeDao;
use app\model\Driver;
use Exception;
use app\model\Trip;
use app\model\TripAudit;
use app\model\TripCancellationCustomerFee;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 10/04/2019
 * Time: 10:38
 */
class TripCancellationFeeBalanceService
{
    private $balanceDao;
    private $balanceFlowDao;
    private $dao;
    private $driverDao;

    public function __construct()
    {
        $this->dao = new TripCancellationCustomerFeeDao;
        $this->balanceDao = new DriverBalanceDao;
        $this->balanceFlowDao = new BalanceFlowDao;
        $this->driverDao = new DriverDao;
    }

    /**
     * @param Trip $trip
     * @param $balanceId
     * @return float
     * @throws Exception
     */
    public function manageFee(Trip $trip, $balanceId): float
    {
        $cancellationFees = $this->getCancellationFees($trip);

        if (empty($cancellationFees))
            return 0;

        $feeValue = 0;

        $property = "balance";
        $type = DriverBalanceConst::BALANCE_OUT_CANCELLATION_FEE;
        $method = "sub";

        if ($trip->getTripAuditId() != TripAudit::RELEASED) {
            $property = "blockedBalanceToPay";
            $type = DriverBalanceConst::BALANCE_OUT_CANCELLATION_FEE_IN_ANALYSIS;
            $method = "add";
        }

        foreach ($cancellationFees as $fee) {
            $this->balanceFlowDao
                ->insertWithCancellationFee(
                    $fee->feeValue,
                    $type,
                    $balanceId,
                    $fee->id
                );

            $feeValue += $fee->feeValue;

            $this->insertInImpairedDriver(new TripCancellationCustomerFee($fee), $trip);
        }

        $this->balanceDao->$method($balanceId, (float)$feeValue, $property);

        return $feeValue;
    }

    private function getCancellationFees(Trip $trip)
    {
        $cancellationFees = $this->dao->findByUser($trip->getUserId());

        return $cancellationFees;
    }

    /**
     * @param TripCancellationCustomerFee $cancellationCustomerFee
     * @param \app\model\Trip $trip
     * @throws Exception
     */
    private function insertInImpairedDriver(TripCancellationCustomerFee $cancellationCustomerFee, Trip $trip)
    {
        $driver = new Driver($this->driverDao->findSimple($cancellationCustomerFee->getDriverId()));

        $property = "balance";
        $type = DriverBalanceConst::BALANCE_IN_CANCELLATION_FEE;

        if ($trip->getTripAuditId() != TripAudit::RELEASED) {
            $property = "blockedBalance";
            $type = DriverBalanceConst::BALANCE_IN_CANCELLATION_FEE_IN_ANALYSIS;
        }

        $this->balanceFlowDao
            ->insertWithCancellationFee(
                $cancellationCustomerFee->getFeeValue(),
                $type,
                $driver->getBalanceId(),
                $cancellationCustomerFee->getId()
            );

        $this->balanceDao->add($driver->getBalanceId(),
            $cancellationCustomerFee->getFeeValue(), $property);

        $this->dao
            ->updatePaidTripReference($cancellationCustomerFee->getId(), $trip->getTripReference());
    }
}