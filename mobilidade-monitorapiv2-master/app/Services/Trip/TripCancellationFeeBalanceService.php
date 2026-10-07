<?php


namespace App\Services\Trip;


use App\Constants\Balance\DriverBalanceConst;
use App\Constants\Trip\TripAuditConst;
use App\Models\Trip\Trip;
use App\Repositories\Balance\BalanceFlowRepository;
use App\Repositories\Balance\BalanceRepository;
use App\Repositories\Trip\TripCancellationCustomerFeeRepository;

class TripCancellationFeeBalanceService
{
    private $tripCancellationCustomerFeeRepository;
    private $balanceFlowRepository;
    private $balanceRepository;

    public function __construct(
        TripCancellationCustomerFeeRepository $tripCancellationCustomerFeeRepository,
        BalanceFlowRepository $balanceFlowRepository,
        BalanceRepository $balanceRepository
    )
    {
        $this->tripCancellationCustomerFeeRepository = $tripCancellationCustomerFeeRepository;
        $this->balanceFlowRepository = $balanceFlowRepository;
        $this->balanceRepository = $balanceRepository;
    }

    /**
     * @param Trip $trip
     * @param $balanceId
     * @return float
     * @throws \Exception
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

        if ($trip->tripAuditId != TripAuditConst::RELEASED) {
            $property = "blockedBalanceToPay";
            $type = DriverBalanceConst::BALANCE_OUT_CANCELLATION_FEE_IN_ANALYSIS;
            $method = "add";
        }

        foreach ($cancellationFees as $fee) {
            $this->balanceFlowRepository
                ->insertWithCancellationFee(
                    $fee->feeValue,
                    $type,
                    $balanceId,
                    $fee->id
                );

            $feeValue += $fee->feeValue;

            $this->insertInImpairedDriver($fee, $trip);
        }

        $this->balanceRepository->$method($balanceId, (float)$feeValue, $property);

        return $feeValue;
    }


    private function getCancellationFees(Trip $trip)
    {
        $cancellationFees = $this->tripCancellationCustomerFeeRepository->findByUser($trip->userId);

        return $cancellationFees;
    }

    private function insertInImpairedDriver($cancellationCustomerFee, Trip $trip)
    {
        $driver = $trip->driver;

        $property = "balance";
        $type = DriverBalanceConst::BALANCE_IN_CANCELLATION_FEE;

        if ($trip->tripAuditId != TripAuditConst::RELEASED) {
            $property = "blockedBalance";
            $type = DriverBalanceConst::BALANCE_IN_CANCELLATION_FEE_IN_ANALYSIS;
        }

        $this->balanceFlowRepository
            ->insertWithCancellationFee(
                $cancellationCustomerFee->feeValue,
                $type,
                $driver->balanceId,
                $cancellationCustomerFee->id
            );

        $this->balanceRepository->add($driver->getBalanceId(),
            $cancellationCustomerFee->feeValue, $property);

        $this->tripCancellationCustomerFeeRepository
            ->updatePaidTripReference($cancellationCustomerFee->id, $trip->tripReference);
    }
}
