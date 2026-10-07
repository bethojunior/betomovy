<?php

namespace app\services;

use app\constant\DriverBalanceConst;
use app\constant\PaymentFormTypeConst;
use app\dao\BalanceFlowDao;
use app\dao\DriverBalanceDao;
use app\dao\TripTaxDao;
use app\model\Trip;
use app\model\TripAudit;
use app\services\payment\split\SaveDriverSplitValueService;
use Exception;

class TripTaxService
{
    private $dao;
    private $balanceFlowDao;
    private $driverBalanceDao;

    public function __construct()
    {
        $this->dao = new TripTaxDao();
        $this->balanceFlowDao = new BalanceFlowDao();
        $this->driverBalanceDao = new DriverBalanceDao();
    }

    /**
     * @throws Exception
     */
    public function manageTaxes(Trip $trip, int $balanceId, int $paymentFormTypeId): float
    {
        $chargeByTypes = $this->driverReceivedFullPaymentDirectly($paymentFormTypeId)
            ? ['driver', 'customer']
            : ['driver'];

        $taxes = $this->dao->findByTrip($trip->getIdTrip(), $chargeByTypes);

        if (empty($taxes)) {
            return 0;
        }

        $taxValue = 0;

        $property = "balance";
        $type = DriverBalanceConst::EXIT_DYNAMIC_TAX;
        $method = "sub";

        if ($trip->getTripAuditId() != TripAudit::RELEASED) {
            $property = "blockedBalanceToPay";
            $type = DriverBalanceConst::BLOCKED_EXIT_DYNAMIC_TAX;
            $method = "add";
        }

        foreach ($taxes as $tax) {
            $value = $tax->valueType === '$' ? $tax->value : ($trip->getPrice() * ($tax->value / 100));
            $this->balanceFlowDao
                ->insert(
                    $value,
                    $type,
                    $balanceId,
                    $trip->getTripReference(),
                    $tax->id
                );

            $taxValue += $value;
        }

        if ($paymentFormTypeId == PaymentFormTypeConst::CREDIT_CARD) {
            $saved = (new SaveDriverSplitValueService())->saveOrUpdateIfSplitEnabled($trip, ($taxValue * -1));

            if ($saved) {
                return $taxValue;
            }
        }

        $this->driverBalanceDao->$method($balanceId, (float)$taxValue, $property);

        return $taxValue;
    }

    private function driverReceivedFullPaymentDirectly(int $paymentFormTypeId): bool
    {
        return in_array($paymentFormTypeId, [
            PaymentFormTypeConst::MONEY,
            PaymentFormTypeConst::PIX,
            PaymentFormTypeConst::PAYMENT_IN_LOCO,
            PaymentFormTypeConst::TAXIMETER,
            PaymentFormTypeConst::DEBIT_CARD,
            PaymentFormTypeConst::MULTIPLE,
        ], true);
    }
}