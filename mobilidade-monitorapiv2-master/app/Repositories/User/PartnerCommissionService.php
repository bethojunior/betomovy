<?php


namespace App\Repositories\User;


use App\Constants\Trip\CommissionTypeConst;
use App\Models\Trip\Trip;
use App\Repositories\Trip\PartnerCommissionRepository;

class PartnerCommissionService
{
    private $partnerCommissionRepository;

    public function __construct(PartnerCommissionRepository $partnerCommissionRepository)
    {
        $this->partnerCommissionRepository = $partnerCommissionRepository;
    }

    /**
     * @param $type
     * @param $commissionValue
     * @param $grossValue
     * @return float|int
     * @throws \Exception
     */
    protected function getValueByType($type, $commissionValue, $grossValue)
    {
        switch ($type) {
            case CommissionTypeConst::PERCENTAGE:
                return $this->percentage($grossValue, $commissionValue);
            case CommissionTypeConst::FIXED_VALUE:
                return $commissionValue;
            default:
                throw new \Exception;
        }
    }

    /**
     * @param Trip $trip
     * @return array
     * @throws \Exception
     */
    public function calculateCommission(Trip $trip)
    {
        $partnerCommission = $this->partnerCommissionRepository->find($trip->partnerCommissionId);
        $partnerValue = $this->getValueByType(
            $partnerCommission->partnerCommissionType,
            $partnerCommission->partnerCommissionValue,
            $trip->price
        );
        $totalValue = $partnerValue;

        return compact(
            'partnerValue',
            'totalValue'
        );
    }

    protected function percentage($value, $percentage)
    {
        return $value * ($percentage / 100);
    }
}
