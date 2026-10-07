<?php

namespace app\services;

use app\constant\DriverBalanceConst;
use app\dao\BalanceFlowDao;
use app\dao\DriverBalanceDao;
use app\dao\RewardCampaignTripDao;
use app\dao\RewardTripDao;
use app\model\Driver;
use Exception;
use app\model\RewardCampaignTrip;
use app\model\RewardTrip;
use app\model\Trip;
use app\model\TripAudit;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 26/02/2019
 * Time: 15:45
 */
class DriverRewardTripService
{
    private $rewardTripDao;
    private $balanceDao;
    private $balanceFlowDao;
    private $rewardCampaignTripDao;

    public function __construct()
    {
        $this->rewardTripDao = new RewardTripDao;
        $this->balanceDao = new DriverBalanceDao;
        $this->balanceFlowDao = new BalanceFlowDao;
        $this->rewardCampaignTripDao = new RewardCampaignTripDao;
    }

    /**
     * @param Trip $trip
     * @param \app\model\Driver $driver
     * @return bool
     * @throws Exception
     */
    public function toAwardDriver(Trip $trip, Driver $driver)
    {
        if ($trip->getRewardTripId())
            $this->addReward($driver, $trip->getRewardTripId(), $trip->getTripAuditId());

        $this->addRewardCampaign($trip, $driver);

        return true;
    }

    /**
     * @param Trip $trip
     * @param \app\model\Driver $driver
     * @return bool
     * @throws Exception
     */
    private function addRewardCampaign(Trip $trip, Driver $driver)
    {
        $rewardCampaigns = $this->getRewardCampaignsTrip($trip->getTripReference());

        foreach ($rewardCampaigns as $rewardCampaign) {
            $this->insertBalanceByRewardCampaignTrip(
                $driver->getBalanceId(), $rewardCampaign, $trip->getTripAuditId()
            );
        }

        return true;
    }

    /**
     * @param \app\model\Driver $driver
     * @param $rewardTripId
     * @param null $tripAuditId
     * @return bool
     * @throws Exception
     */
    private function addReward(Driver $driver, $rewardTripId, $tripAuditId)
    {
        $rewardTrip = $this->getRewardTrip($rewardTripId);

        $this->insertBalanceByRewardTrip($driver->getBalanceId(), $rewardTrip, $tripAuditId);

        return true;
    }

    /**
     * @param $balanceId
     * @param RewardTrip $rewardTrip
     * @param $tripAuditId
     * @return bool
     * @throws Exception
     */
    private function insertBalanceByRewardTrip($balanceId, RewardTrip $rewardTrip, $tripAuditId)
    {
        $property = "balance";
        $type = DriverBalanceConst::REWARD_TRIP;

        if ($tripAuditId != TripAudit::RELEASED) {
            $property = "blockedBalance";
            $type = DriverBalanceConst::REWARD_TRIP_BLOCKED;
        }

        $this->balanceDao->add($balanceId, (float)$rewardTrip->getValue(), $property);

        $this->balanceFlowDao
            ->insertWithRewardTrip(
                $rewardTrip->getValue(),
                $type,
                $balanceId,
                $rewardTrip->getId()
            );

        return true;
    }

    /**
     * @param $balanceId
     * @param \app\model\RewardCampaignTrip $rewardCampaign
     * @param $tripAuditId
     * @return bool
     * @throws Exception
     */
    private function insertBalanceByRewardCampaignTrip($balanceId, RewardCampaignTrip $rewardCampaign, $tripAuditId)
    {
        if ($rewardCampaign->getValue() <= 0)
            return false;

        $property = "balance";
        $type = DriverBalanceConst::REWARD_TRIP;

        if ($tripAuditId != TripAudit::RELEASED) {
            $property = "blockedBalance";
            $type = DriverBalanceConst::REWARD_TRIP_BLOCKED;
        }

        $this->balanceDao->add($balanceId, (float)$rewardCampaign->getValue(), $property);

        $this->balanceFlowDao
            ->insertWithRewardCampaignTrip(
                $rewardCampaign->getValue(),
                $type,
                $balanceId,
                $rewardCampaign->getId()
            );

        return true;
    }

    /**
     * @param $rewardTripId
     * @return RewardTrip
     */
    private function getRewardTrip($rewardTripId): RewardTrip
    {
        $reward = $this->rewardTripDao
            ->findOne($rewardTripId);

        return new RewardTrip($reward);
    }

    /**
     * @param $tripReference
     * @return array
     */
    private function getRewardCampaignsTrip($tripReference)
    {
        $rewardCampaigns = $this->rewardCampaignTripDao
            ->findByTrip($tripReference);

        return array_map(function ($rewardCampaign) {
            return new RewardCampaignTrip($rewardCampaign);
        }, $rewardCampaigns);
    }
}