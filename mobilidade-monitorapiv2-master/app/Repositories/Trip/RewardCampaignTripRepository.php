<?php


namespace App\Repositories\Trip;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Trip\RewardCampaignTrip;

class RewardCampaignTripRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(RewardCampaignTrip::class);
    }

    public function findByTrip($tripReference)
    {
        return $this->getModel()
            ::join("rewardTripType as rtt","rtt.id","rewardCampaignTrip.rewardTripTypeId")
            ->where("tripReference",$tripReference)
            ->select([
                "rewardCampaignTrip.*",
                "rtt.name as rewardType"
            ])
            ->get();
    }

    public function findByTripAndRewardTripType($tripReference,$rewardTripTypeId)
    {
        return $this->getModel()
            ::join("rewardTripType as rtt","rtt.id","rewardCampaignTrip.rewardTripTypeId")
            ->where("tripReference",$tripReference)
            ->where("rewardTripTypeId",$rewardTripTypeId)
            ->select([
                "rewardCampaignTrip.*",
                "rtt.name as rewardType"
            ])
            ->get();
    }
}
