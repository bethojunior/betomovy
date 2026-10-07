<?php


namespace App\Repositories\User;


use App\Constants\Balance\DriverBalanceConst;
use App\Constants\Trip\TripAuditConst;
use App\Constants\Users\PartnerBalanceConst;
use App\Models\Trip\Trip;
use App\Models\User\Driver;
use App\Repositories\Balance\BalanceFlowRepository;
use App\Repositories\Balance\BalanceRepository;

class PartnerSplitTripPaymentService
{
    private $partnerCommissionService;
    private $balanceRepository;
    private $balanceFlowRepository;

    public function __construct(
        PartnerCommissionService $partnerCommissionService,
        BalanceRepository $balanceRepository,
        BalanceFlowRepository $balanceFlowRepository
    )
    {
        $this->partnerCommissionService = $partnerCommissionService;
        $this->balanceRepository = $balanceRepository;
        $this->balanceFlowRepository = $balanceFlowRepository;
    }

    public function splitTripPayment(Trip $trip, int $balanceId, Driver $driver)
    {
        $commissions = $this->partnerCommissionService->calculateCommission($trip);

        $this->removeCommissionFromDriver($driver->balanceId, $commissions['totalValue'], $trip);
        $this->addCommissionInPartnerBalance($trip, $balanceId, $commissions['partnerValue']);
    }

    private function removeCommissionFromDriver($driverBalanceId, $value, Trip $trip)
    {
        $property = 'balance';
        $operator = '-';
        $typeFlow = DriverBalanceConst::BALANCE_OUT_PARTNER_COMMISSION;

        if ($trip->tripAuditId != TripAuditConst::RELEASED) {
            $property = 'blockedBalanceToPay';
            $operator = '+';
            $typeFlow = DriverBalanceConst::BALANCE_OUT_PARTNER_COMMISSION_IN_ANALYSIS;
        }

        $this->balanceRepository
            ->updateValue($driverBalanceId, $value, [$property], [$operator]);

        $this->balanceFlowRepository
            ->insert($value, $typeFlow, $driverBalanceId, $trip->tripReference);
    }

    private function addCommissionInPartnerBalance(Trip $trip, $customerBalanceId, $partnerValue)
    {
        $property = 'balance';
        $typeFlow = PartnerBalanceConst::BALANCE_ENTRY_BY_TRIP;

        if ($trip->tripAuditId != TripAuditConst::RELEASED) {
            $property = 'blockedBalance';
            $typeFlow = PartnerBalanceConst::BALANCE_ENTRY_BY_TRIP_IN_ANALYSIS;
        }

        $this->balanceRepository
            ->updateValue($customerBalanceId, $partnerValue, [$property], ['+']);

        $this->balanceFlowRepository
            ->insert($partnerValue, $typeFlow, $customerBalanceId, $trip->tripReference);
    }
}
