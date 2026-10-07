<?php

namespace app\services;

use app\constant\DriverBalanceConst;
use app\constant\ManagerBalanceConst;
use app\constant\ManagerRegisterStatusConst;
use app\constant\PartnerBalanceConst;
use app\constant\PaymentFormTypeConst;
use app\dao\BalanceDao;
use app\dao\BalanceFlowDao;
use app\dao\ManagerDao;
use app\dao\PartnerDao;
use app\exceptions\CommissionException;
use app\exceptions\PartnerCommissionException;
use app\model\Driver;
use app\model\Manager;
use app\model\Partner;
use app\model\Trip;
use app\model\TripAudit;
use app\services\payment\split\SaveDriverSplitValueService;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/05/2019
 * Time: 09:36
 */
class PartnerSplitTripPaymentService
{
    private $balanceDao;
    private $partnerCommissionService;
    private $balanceFlowDao;
    private $managerDao;
    private $dao;

    public function __construct()
    {
        $this->partnerCommissionService = new PartnerCommissionService;
        $this->balanceDao = new BalanceDao;
        $this->balanceFlowDao = new BalanceFlowDao;
        $this->managerDao = new ManagerDao;
        $this->dao = new PartnerDao;
    }

    /**
     * @param Trip $trip
     * @param int $balanceId
     * @param Driver $driver
     * @param int $paymentFormTypeId
     * @return array
     * @throws CommissionException
     * @throws PartnerCommissionException
     * @throws Exception
     */
    public function splitTripPayment(Trip $trip, int $balanceId, Driver $driver, int $paymentFormTypeId): array
    {
        $commissions = $this->partnerCommissionService->calculateCommission($trip);

        $this->removeCommissionFromDriver(
            $driver->getBalanceId(),
            $commissions['totalValue'],
            $trip,
            $paymentFormTypeId
        );

        (new TripTaxService())->manageTaxes($trip, $driver->getBalanceId(), $paymentFormTypeId);

        $this->addCommissionInPartnerBalance($trip, $balanceId, $commissions['partnerValue']);

        return $commissions;
    }

    /**
     * @param $driverBalanceId
     * @param $value
     * @param Trip $trip
     * @param int $paymentFormTypeId
     * @return void
     * @throws Exception
     */
    private function removeCommissionFromDriver($driverBalanceId, $value, Trip $trip, int $paymentFormTypeId)
    {
        $updateBalance = true;
        $property = 'balance';
        $operator = '-';
        $typeFlow = DriverBalanceConst::BALANCE_OUT_PARTNER_COMMISSION;

        if ($trip->getTripAuditId() != TripAudit::RELEASED) {
            $property = 'blockedBalanceToPay';
            $operator = '+';
            $typeFlow = DriverBalanceConst::BALANCE_OUT_PARTNER_COMMISSION_IN_ANALYSIS;
        }

        $this->balanceFlowDao
            ->insert($value, $typeFlow, $driverBalanceId, $trip->getTripReference());

        if ($paymentFormTypeId == PaymentFormTypeConst::CREDIT_CARD) {
            $saved = (new SaveDriverSplitValueService())->saveOrUpdateIfSplitEnabled($trip, ($value * -1));

            if ($saved) {
                $updateBalance = false;
            }
        }

        if ($updateBalance) {
            $this->balanceDao
                ->update($driverBalanceId, $value, [$property], [$operator]);
        }
    }

    /**
     * @param Trip $trip
     * @param $customerBalanceId
     * @param $partnerValue
     * @return void
     * @throws Exception
     */
    private function addCommissionInPartnerBalance(Trip $trip, $customerBalanceId, $partnerValue)
    {
        $property = 'balance';
        $typeFlow = PartnerBalanceConst::BALANCE_ENTRY_BY_TRIP;

        if ($trip->getTripAuditId() != TripAudit::RELEASED) {
            $property = 'blockedBalance';
            $typeFlow = PartnerBalanceConst::BALANCE_ENTRY_BY_TRIP_IN_ANALYSIS;
        }

        $this->balanceDao
            ->update($customerBalanceId, $partnerValue, [$property], ['+']);

        $this->balanceFlowDao
            ->insert($partnerValue, $typeFlow, $customerBalanceId, $trip->getTripReference());
    }

    /**
     * @param Trip $trip
     * @param $managerId
     * @param $managerValue
     * @throws Exception
     */
    private function addCommissionInManagerBalance(Trip $trip, $managerId, $managerValue)
    {
        $manager = $this->findManager($managerId);

        if ($manager) {
            $property = 'balance';
            $typeFlow = ManagerBalanceConst::BALANCE_ENTRY_BY_TRIP;

            if ($trip->getTripAuditId() != TripAudit::RELEASED) {
                $property = 'blockedBalance';
                $typeFlow = PartnerBalanceConst::BALANCE_ENTRY_BY_TRIP_IN_ANALYSIS;
            }

            $this->balanceDao
                ->update($manager->getBalanceId(), $managerValue, [$property], ['+']);

            $this->balanceFlowDao
                ->insert($managerValue, $typeFlow, $manager->getBalanceId(), $trip->getTripReference());
        }
    }

    private function findPartnerByUser($userId)
    {
        $partner = $this->dao
            ->findByUser($userId);

        return new Partner($partner);
    }

    /**
     * @param $id
     * @return Manager|null
     */
    private function findManager($id)
    {
        $manager = $this->managerDao
            ->find($id);

        if (!$manager || $manager->managerRegisterStatusId != ManagerRegisterStatusConst::ACTIVE)
            return null;

        return new Manager($manager);
    }
}