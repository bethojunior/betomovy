<?php

namespace app\services;

use app\constant\RewardTripTypeConst;
use app\dao\PriceDao;
use app\dao\RewardCampaignTripDao;
use app\dao\TripCancellationCustomerFeeDao;
use Exception;
use app\model\RewardCampaignTrip;
use app\model\Trip;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 16/03/2019
 * Time: 13:25
 */
class MinPriceRewardTripService
{
    private $priceDao;
    private $rewardCampaignTripDao;
    private $tripCancellationCustomerFeeDao;

    public function __construct()
    {
        $this->priceDao = new PriceDao;
        $this->rewardCampaignTripDao = new RewardCampaignTripDao;
        $this->tripCancellationCustomerFeeDao = new TripCancellationCustomerFeeDao;
    }

    /**
     * @param Trip $trip
     * @return bool
     * @throws Exception
     */
    public function generate(Trip $trip): bool
    {
        $price = $trip->getPriceId() ?
            $this->priceDao
                ->findById($trip->getPriceId()) :
            $this->priceDao
                ->find($trip->getTripTypeId(), $trip->getCityId());

        $cancellationFeeValue = $this->getCancellationFeesValue($trip->getUserId());
        $tripPrice = $trip->getPrice() - $cancellationFeeValue;

        if ($price->getPromotionalPriceTemp() > 0 &&
            (
                $tripPrice <= $price->getPromotionalPriceTemp() ||
                $tripPrice <= $price->getMinPrice()
            )
        ) {
            $this->insertRewardCampaign(
                $price->getRewardDriverMinPrice(),
                $trip->getTripReference(),
                RewardTripTypeConst::REWARD_CAMPAIGN_MIN_PRICE
            );

            return true;
        }

        return false;
    }

    private function insertRewardCampaign($value, $tripReference, $rewardTripTypeId)
    {
        $reward = new RewardCampaignTrip;
        $reward
            ->setValue($value ?? 0)
            ->setTripReference($tripReference)
            ->setRewardTripTypeId($rewardTripTypeId)
            ->setId(
                $this->rewardCampaignTripDao
                    ->sqlInsert($reward)
            );

        return $reward;
    }

    /**
     * @param $userId
     * @return float
     */
    private function getCancellationFeesValue($userId): float
    {
        $value = 0;

        $fees = $this->tripCancellationCustomerFeeDao
            ->findByUser($userId);

        foreach ($fees as $fee) {
            $value += $fee->feeValue;
        }

        return (float)$value;
    }
}