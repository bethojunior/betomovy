<?php


namespace App\Services\Driver;


use App\Constants\Balance\DriverBalanceConst;
use App\Constants\Trip\TripAuditConst;
use App\Models\Balance\BalanceFlow;
use App\Models\Trip\RewardCampaignTrip;
use App\Models\Trip\RewardTrip;
use App\Models\Trip\Trip;
use App\Models\User\Driver;
use App\Repositories\Balance\BalanceFlowRepository;
use App\Repositories\Balance\BalanceRepository;
use App\Repositories\Trip\RewardCampaignTripRepository;
use App\Repositories\User\Driver\RewardTripRepository;
use Carbon\Carbon;

class DriverRewardTripService
{
    private $rewardTripRepository;
    private $balanceRepository;
    private $balanceFlowRepository;
    private $rewardCampaignTripRepository;

    public function __construct(
        RewardTripRepository $rewardTripRepository,
        BalanceRepository $balanceRepository,
        BalanceFlowRepository $balanceFlowRepository,
        RewardCampaignTripRepository $rewardCampaignTripRepository
    )
    {
        $this->rewardTripRepository = $rewardTripRepository;
        $this->balanceRepository = $balanceRepository;
        $this->rewardCampaignTripRepository = $rewardCampaignTripRepository;
        $this->balanceFlowRepository = $balanceFlowRepository;
    }


    /**
     * @param Trip $trip
     * @param Driver $driver
     * @return bool
     * @throws \Exception
     */
    public function toAwardDriver(Trip $trip, Driver $driver)
    {
        if ($trip->rewardTripId)
            $this->addReward($driver, $trip->rewardTripId, $trip->tripAuditId);

        $this->addRewardCampaign($trip, $driver);

        return true;
    }

    /**
     * @param Driver $driver
     * @param $rewardTripId
     * @param null $tripAuditId
     * @return bool
     * @throws \Exception
     */
    private function addReward(Driver $driver, $rewardTripId, $tripAuditId)
    {
        $rewardTrip = $this->getRewardTrip($rewardTripId);

        $this->insertBalanceByRewardTrip($driver->balanceId, $rewardTrip, $tripAuditId);

        return true;
    }

    private function getRewardTrip($rewardTripId)
    {
        return $this->rewardTripRepository->find($rewardTripId);
    }

    /**
     * @param Trip $trip
     * @param Driver $driver
     * @return bool
     * @throws \Exception
     */
    private function addRewardCampaign(Trip $trip, Driver $driver)
    {
        $rewardCampaigns = $this->getRewardCampaignsTrip($trip->tripReference);

        foreach ($rewardCampaigns as $rewardCampaign) {
            $this->insertBalanceByRewardCampaignTrip(
                $driver->balanceId, $rewardCampaign, $trip->tripAuditId
            );
        }

        return true;
    }

    private function insertBalanceByRewardTrip($balanceId, RewardTrip $rewardTrip, $tripAuditId)
    {
        $property = "balance";
        $type = DriverBalanceConst::REWARD_TRIP;

        if ($tripAuditId != TripAuditConst::RELEASED) {
            $property = "blockedBalance";
            $type = DriverBalanceConst::REWARD_TRIP_BLOCKED;
        }

        $this->balanceRepository->add($balanceId, (float)$rewardTrip->value, $property);

        $this->insertWithRewardTrip(
            $rewardTrip->value,
            $type,
            $balanceId,
            $rewardTrip->id
        );

        return true;
    }

    private function insertWithRewardTrip($value, $balanceType, $balanceId, $rewardCampaignTripId)
    {
        $balanceFlow = new BalanceFlow;
        $balanceFlow->date = Carbon::now();
        $balanceFlow->value = $value;
        $balanceFlow->balanceFlowTypeId = $balanceType;
        $balanceFlow->balanceId = $balanceId;
        $balanceFlow->rewardCampaignTripId = $rewardCampaignTripId;

        $balanceFlow->save();

        return $balanceFlow;
    }

    /**
     * @param $tripReference
     * @return array
     */
    private function getRewardCampaignsTrip($tripReference)
    {
        return $this->rewardCampaignTripRepository
            ->findByTrip($tripReference);
    }

    private function insertBalanceByRewardCampaignTrip($balanceId, RewardCampaignTrip $rewardCampaign, $tripAuditId)
    {
        if ($rewardCampaign->value <= 0)
            return false;

        $property = "balance";
        $type = DriverBalanceConst::REWARD_TRIP;

        if ($tripAuditId != TripAuditConst::RELEASED) {
            $property = "blockedBalance";
            $type = DriverBalanceConst::REWARD_TRIP_BLOCKED;
        }

        $this->balanceRepository->add($balanceId, (float) $rewardCampaign->value, $property);

        $this->balanceFlowRepository
            ->insertWithRewardCampaignTrip(
                $rewardCampaign->value,
                $type,
                $balanceId,
                $rewardCampaign->id
            );

        return true;
    }
}
