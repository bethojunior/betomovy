<?php

namespace app\services;

use app\constant\DriverBalanceConst;
use app\constant\PartnerBalanceConst;
use app\dao\BalanceDao;
use app\dao\BalanceFlowDao;
use app\dao\BlockedTripDao;
use app\dao\TripDao;
use Exception;
use app\model\TripAudit;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 06/05/2019
 * Time: 15:41
 */
class BlockedTripService
{
    private $dao;
    private $balanceFlowDao;
    private $balanceDao;
    private $tripDao;

    public function __construct()
    {
        $this->dao = new BlockedTripDao;
        $this->balanceFlowDao = new BalanceFlowDao;
        $this->balanceDao = new BalanceDao;
        $this->tripDao = new TripDao;
    }

    /**
     * @return array|mixed
     */
    public function findBlockedTrips()
    {
        $trips = $this->dao
            ->findBlockedTrips();

        return $trips;
    }

    /**
     * @param $tripReference
     * @return array|mixed
     */
    public function findBlockedBalanceFlows($tripReference)
    {
        $balanceFlows = $this->dao
            ->findBlockedBalanceFlows($tripReference);

        return $balanceFlows;
    }

    /**
     * @param $tripReference
     * @return bool
     * @throws Exception
     */
    public function releaseAuditTrip($tripReference)
    {
        return $this->tripDao
            ->updateAudit($tripReference, TripAudit::AUTOMATICALLY_RELEASED);
    }

    /**
     * @param $idBalanceFlow
     * @param null $tripPaymentFormId
     * @return bool
     * @throws Exception
     */
    public function releaseFlowType($idBalanceFlow, $tripPaymentFormId = null)
    {
        $balanceFlow = $this->balanceFlowDao
            ->find($idBalanceFlow);

        switch ($balanceFlow->balanceFlowTypeId) {
            case PartnerBalanceConst::BALANCE_ENTRY_BY_CALL_MONEY_IN_CAR_ANALYSIS:
                $this->balanceFlowDao
                    ->updateType($idBalanceFlow, PartnerBalanceConst::BALANCE_ENTRY_BY_CALL_MONEY_IN_CAR);
                $this->addBalance($balanceFlow->balanceId, $balanceFlow->value);
                return true;

            case DriverBalanceConst::BALANCE_OUT_COMMISSIONS_IN_ANALYSIS:
                $this->balanceFlowDao
                    ->updateType($idBalanceFlow, DriverBalanceConst::BALANCE_OUT_COMMISSIONS);
                $this->subBalance($balanceFlow->balanceId, $balanceFlow->value);
                return true;

            case DriverBalanceConst::BALANCE_ENTRY_BY_TRIP_IN_ANALYSIS:
                $this->balanceFlowDao
                    ->updateType($idBalanceFlow, DriverBalanceConst::BALANCE_ENTRY_BY_TRIP);
                $this->addBalance($balanceFlow->balanceId, $balanceFlow->value);
                return true;

            case DriverBalanceConst::BALANCE_OUT_RATE_PAYMENT_FORM_IN_ANALYSIS:
                $this->balanceFlowDao
                    ->updateType($idBalanceFlow, DriverBalanceConst::BALANCE_OUT_RATE_PAYMENT_FORM);
                $this->subBalance($balanceFlow->balanceId, $balanceFlow->value);

                return true;

            case DriverBalanceConst::REWARD_TRIP_BLOCKED:
                $this->balanceFlowDao
                    ->updateType($idBalanceFlow, DriverBalanceConst::REWARD_TRIP);
                $this->addBalance($balanceFlow->balanceId, $balanceFlow->value);
                return true;

            case DriverBalanceConst::BONUS_MONETIZATION_BLOCKED:
                $this->balanceFlowDao
                    ->updateType($idBalanceFlow, DriverBalanceConst::BONUS_MONETIZATION);
                $this->addBalance($balanceFlow->balanceId, $balanceFlow->value);
                return true;

            case DriverBalanceConst::BALANCE_IN_CANCELLATION_FEE_IN_ANALYSIS:
                $this->balanceFlowDao
                    ->updateType($idBalanceFlow, DriverBalanceConst::BALANCE_IN_CANCELLATION_FEE);
                $this->addBalance($balanceFlow->balanceId, $balanceFlow->value);
                return true;

            case DriverBalanceConst::BALANCE_OUT_CANCELLATION_FEE_IN_ANALYSIS:
                $this->balanceFlowDao
                    ->updateType($idBalanceFlow, DriverBalanceConst::BALANCE_OUT_CANCELLATION_FEE);
                $this->subBalance($balanceFlow->balanceId, $balanceFlow->value);
                return true;

            case DriverBalanceConst::BALANCE_OUT_PARTNER_COMMISSION_IN_ANALYSIS:
                $this->balanceFlowDao
                    ->updateType($idBalanceFlow,
                        DriverBalanceConst::BALANCE_OUT_PARTNER_COMMISSION);
                $this->subBalance($balanceFlow->balanceId, $balanceFlow->value);
                return true;

            case PartnerBalanceConst::BALANCE_ENTRY_BY_TRIP_IN_ANALYSIS:
                $this->balanceFlowDao
                    ->updateType($idBalanceFlow, PartnerBalanceConst::BALANCE_ENTRY_BY_TRIP);
                $this->addBalance($balanceFlow->balanceId, $balanceFlow->value);
                return true;

            case DriverBalanceConst::BLOCKED_ENTRY_DYNAMIC_TAX:
                $this->balanceFlowDao
                    ->updateType($idBalanceFlow, DriverBalanceConst::ENTRY_DYNAMIC_TAX);
                $this->addBalance($balanceFlow->balanceId, $balanceFlow->value);
                return true;

            case DriverBalanceConst::BLOCKED_EXIT_DYNAMIC_TAX:
                $this->balanceFlowDao
                    ->updateType($idBalanceFlow,
                        DriverBalanceConst::EXIT_DYNAMIC_TAX);
                $this->subBalance($balanceFlow->balanceId, $balanceFlow->value);
                return true;
        }

        return null;
    }

    /**
     * @param $balanceId
     * @param $value
     * @throws Exception
     */
    private function addBalance($balanceId, $value)
    {
        writeLn("entrando valor: " . $value);

        $this->balanceDao
            ->update($balanceId, $value, [
                'blockedBalance', 'balance'
            ], [
                '-', '+'
            ]);
    }

    /**
     * @param $balanceId
     * @param $value
     * @throws Exception
     */
    private function subBalance($balanceId, $value)
    {
        writeLn("saindo valor: " . $value);

        $this->balanceDao
            ->update($balanceId, $value, [
                'blockedBalanceToPay', 'balance'
            ], [
                '-', '-'
            ]);
    }
}