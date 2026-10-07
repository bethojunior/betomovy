<?php

namespace app\services;

use app\dao\DriverCommissionAnotherFeeDao;
use app\dao\DriverCommissionDao;
use app\dao\LogDao;
use app\model\DriverCommission;
use app\model\DriverCommissionAnotherFee;
use app\traits\CommissionTrait;
use Exception;

/**
 * Builds the transparent price breakdown required by SENACON Portaria 61/2026.
 */
class SenaconPriceBreakdownService
{
    use CommissionTrait;

    private $driverCommissionDao;
    private $anotherFeeDao;
    private $logDao;

    public function __construct()
    {
        $this->driverCommissionDao = new DriverCommissionDao;
        $this->anotherFeeDao = new DriverCommissionAnotherFeeDao;
        $this->logDao = new LogDao;
    }

    /**
     * @param int $cityId
     * @param int $tripTypeId
     * @param float $totalPrice
     * @param float $partnerStackValue
     * @return array{platformAmount: float, driverAmount: float}
     */
    public function build($cityId, $tripTypeId, $totalPrice, $partnerStackValue = 0.0)
    {
        $driverCommissionBase = max(((float)$totalPrice) - (float)$partnerStackValue, 0.0);
        $platformAmount = (float)$partnerStackValue;

        try {
            $platformAmount += $this->calculateDriverCommission(
                $cityId,
                $tripTypeId,
                $driverCommissionBase
            );
        } catch (Exception $e) {
            $this->logDao->logException($e, 'SenaconPriceBreakdownService::build');
            $platformAmount = (float)$partnerStackValue;
        }

        $platformAmount = round(min(max($platformAmount, 0.0), (float)$totalPrice), 2);
        $driverAmount = round(((float)$totalPrice) - $platformAmount, 2);

        return [
            'platformAmount' => $platformAmount,
            'driverAmount' => $driverAmount,
        ];
    }

    /**
     * @param int $cityId
     * @param int $tripTypeId
     * @param float $grossValue
     * @return float
     * @throws Exception
     */
    private function calculateDriverCommission($cityId, $tripTypeId, $grossValue)
    {
        $row = $this->driverCommissionDao->findByCityAndTripType($cityId, $tripTypeId);

        if (!$row) {
            return 0.0;
        }

        $commission = new DriverCommission($row);
        $commissionAmount = (float)$this->getValueByType(
            $commission->getValueType(),
            $commission->getValue(),
            $grossValue
        );

        return $commissionAmount + $this->calculateAnotherFees(
            $commission->getIdDriverCommission(),
            $grossValue
        );
    }

    /**
     * @param int $driverCommissionId
     * @param float $grossValue
     * @return float
     * @throws Exception
     */
    private function calculateAnotherFees($driverCommissionId, $grossValue)
    {
        $row = $this->anotherFeeDao->findByDriverCommission($driverCommissionId);

        if (!$row) {
            return 0.0;
        }

        $anotherFee = new DriverCommissionAnotherFee($row);
        $taxValue = (float)$this->getValueByType(
            $anotherFee->getValueType(),
            $anotherFee->getTaxValue(),
            $grossValue
        );
        $anotherValue = (float)$this->getValueByType(
            $anotherFee->getValueType(),
            $anotherFee->getAnotherValue(),
            $grossValue
        );

        return $taxValue + $anotherValue;
    }
}
