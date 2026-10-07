<?php

namespace app\services;

use app\constant\CommissionTypeConst;
use app\dao\DriverCommissionAnotherFeeDao;
use app\dao\DriverCommissionDao;
use app\dao\DriverCommissionPaymentFormDao;
use app\dao\TripTaxDao;
use app\exceptions\CommissionException;
use app\exceptions\DriverCommissionException;
use app\services\contracts\CommissionService;
use app\model\DriverCommission;
use app\model\DriverCommissionAnotherFee;
use app\model\DriverCommissionPaymentForm;
use app\model\Origin;
use app\model\Trip;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 07/02/2019
 * Time: 10:29
 */
class DriverCommissionService extends CommissionService
{
    private $dao;
    private $paymentFormCommissionsDao;
    private $anotherFeeCommissionDao;

    public function __construct()
    {
        $this->dao = new DriverCommissionDao;
        $this->paymentFormCommissionsDao = new DriverCommissionPaymentFormDao;
        $this->anotherFeeCommissionDao = new DriverCommissionAnotherFeeDao;
    }

    /**
     * @param $cityId
     * @param $tripTypeId
     * @param null|\app\model\Origin $origin
     * @return DriverCommission
     * @throws DriverCommissionException
     */
    public function findByCityAndTripType($cityId, $tripTypeId, ?Origin $origin = null): DriverCommission
    {
        $commission = $this->dao
            ->findByCityAndTripType($cityId, $tripTypeId);

        if (!$commission && $origin)
            $commission = $this->dao
                ->findByOriginAndTripType($origin, $tripTypeId);

        if (!$commission)
            throw new DriverCommissionException(1350, [
                'city' => $cityId,
                'tripTypeId' => $tripTypeId
            ]);

        return new DriverCommission($commission);
    }

    /**
     * @param $cityId
     * @param $tripTypeId
     * @param null|Origin $origin
     * @return int
     * @throws DriverCommissionException
     */
    public function findCommissionId($cityId, $tripTypeId, ?Origin $origin = null)
    {
        $commission = $this->findByCityAndTripType($cityId, $tripTypeId, $origin);

        return (int)$commission->getIdDriverCommission();
    }

    /**
     * @param $driverCommissionId
     * @return DriverCommission
     * @throws DriverCommissionException
     */
    public function find($driverCommissionId): DriverCommission
    {
        $commission = $this->dao
            ->find($driverCommissionId);

        if (!$commission)
            throw new DriverCommissionException(1351);

        $commission = new DriverCommission($commission);

        $commission->setPaymentFormCommissions(
            $this->getPaymentFormCommissions($commission->getIdDriverCommission())
        );

        $commission->setAnotherFee(
            $this->getAnotherFeeCommission($commission->getIdDriverCommission())
        );

        return $commission;
    }

    /**
     * @param DriverCommission $driverCommission
     * @param Trip $trip
     * @param float $cancellationFeeValue
     * @return float|int
     * @throws CommissionException
     */
    public function calculateCommission(DriverCommission $driverCommission, Trip $trip, float $cancellationFeeValue = 0)
    {
        $price = $trip->getPrice() - $cancellationFeeValue;

        $appCommission =
            $this->getValueByType($driverCommission->getValueType(), $driverCommission->getValue(), $price);

        /**
         * Se houver outras taxas a ser acrescentadas a comissão
         * será adicionado no método abaixo
         */
        if ($driverCommission->getAnotherFee())
            $appCommission +=
                $this->calculateByAnotherFees($driverCommission->getAnotherFee(), $price);

        return $appCommission;
    }

    /**
     * @param DriverCommission $driverCommission
     * @param Trip $trip
     * @return float|int|null
     * @throws CommissionException
     */
    public function calculateRatePaymentForm(DriverCommission $driverCommission, Trip $trip)
    {
        return $this->calculateByPaymentForm(
            $driverCommission->getPaymentFormCommissions(), $trip
        );
    }

    /**
     * @param array $paymentFormCommissions
     * @param \app\model\Trip $trip
     * @return float|int|null
     * @throws CommissionException
     */
    private function calculateByPaymentForm(array $paymentFormCommissions, Trip $trip)
    {
        /** @var \app\model\DriverCommissionPaymentForm $paymentFormCommission */
        $paymentFormCommission = array_filter(
            $paymentFormCommissions,
            function (DriverCommissionPaymentForm $commissionPaymentForm) use ($trip) {
                return $commissionPaymentForm->getTripPaymentFormId() == $trip->getTripPaymentFormId();
            }
        );

        $paymentFormCommission = end($paymentFormCommission);

        return $paymentFormCommission ?
            $this->getValueByType(
                $paymentFormCommission->getValueType(),
                $paymentFormCommission->getValue(),
                $trip->getPrice()
            ) :
            null;
    }

    /**
     * @param DriverCommissionAnotherFee $commissionAnotherFee
     * @param $grossValue
     * @return float|int
     * @throws CommissionException
     */
    private function calculateByAnotherFees(DriverCommissionAnotherFee $commissionAnotherFee, $grossValue)
    {
        $fee = $this->getValueByType(
            $commissionAnotherFee->getValueType(),
            $commissionAnotherFee->getTaxValue(),
            $grossValue
        );

        $fee += $this->getValueByType(
            $commissionAnotherFee->getValueType(),
            $commissionAnotherFee->getAnotherValue(),
            $grossValue
        );

        return $fee;
    }

    /**
     * Breakdown separado por linha do desconto do motorista (mesmas contas de calculateCommission).
     *
     * @param DriverCommission $driverCommission
     * @param Trip $trip
     * @param float $cancellationFeeValue
     * @return array
     * @throws CommissionException
     */
    public function buildFinancialBreakdown(DriverCommission $driverCommission, Trip $trip, float $cancellationFeeValue = 0): array
    {
        $price = $trip->getPrice() - $cancellationFeeValue;

        $appFee = $this->getValueByType($driverCommission->getValueType(), $driverCommission->getValue(), $price);

        $anotherFee = $driverCommission->getAnotherFee()
            ? $this->calculateByAnotherFees($driverCommission->getAnotherFee(), $price)
            : 0;

        $paymentFormFee = $this->calculateRatePaymentForm($driverCommission, $trip) ?? 0;

        $dynamicTax = $this->calculateDynamicTax($trip);

        return [
            'appFeePercentage' => $driverCommission->getValueType() === CommissionTypeConst::PERCENTAGE
                ? $driverCommission->getValue()
                : null,
            'appFee' => $appFee,
            'anotherFee' => $anotherFee,
            'paymentFormFee' => $paymentFormFee,
            'cancellationFee' => $cancellationFeeValue,
            'dynamicTax' => $dynamicTax,
        ];
    }

    private function calculateDynamicTax(Trip $trip): float
    {
        $taxes = (new TripTaxDao())->findByTrip($trip->getIdTrip(), ['driver', 'customer']);

        $total = 0;

        foreach ($taxes as $tax) {
            $total += $tax->valueType === '$' ? $tax->value : ($trip->getPrice() * ($tax->value / 100));
        }

        return $total;
    }

    /**
     * @param $driverCommissionId
     * @return array
     */
    private function getPaymentFormCommissions($driverCommissionId)
    {
        $commissions = $this->paymentFormCommissionsDao
            ->findByCommissionId($driverCommissionId);

        return array_map(function ($commission) {
            return new DriverCommissionPaymentForm($commission);
        }, $commissions);
    }

    /**
     * @param $driverCommissionId
     * @return DriverCommissionAnotherFee|null
     */
    private function getAnotherFeeCommission($driverCommissionId): ?DriverCommissionAnotherFee
    {
        $commission = $this->anotherFeeCommissionDao
            ->findByDriverCommission($driverCommissionId);

        return $commission ?
            new DriverCommissionAnotherFee($commission) :
            null;
    }
}