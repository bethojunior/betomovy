<?php

namespace app\services;

use app\constant\RewardTripTypeConst;
use app\dao\RewardCampaignTripDao;
use app\dao\TripDiscountCouponDao;
use app\dao\UserDiscountCouponDao;
use app\exceptions\DiscountCouponException;
use app\model\RewardCampaignTrip;
use app\model\Trip;
use app\model\TripDiscountCoupon;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/11/2019
 * Time: 17:21
 */
class CustomerDiscountCouponService
{
    private $dao;
    private $tripDiscountCouponDao;
    private $rewardCampaignTripDao;

    public function __construct()
    {
        $this->dao = new UserDiscountCouponDao;
        $this->tripDiscountCouponDao = new TripDiscountCouponDao;
        $this->rewardCampaignTripDao = new RewardCampaignTripDao;
    }

    /**
     * @param $userDiscountCouponId
     * @param $oldPrice
     * @param Trip $trip
     * @throws DiscountCouponException
     */
    public function useCoupon($userDiscountCouponId, $oldPrice, Trip $trip)
    {
        $userDiscountCoupon = $this->dao->find($userDiscountCouponId);

        if (empty($userDiscountCoupon))
            throw new DiscountCouponException(1704);

        $this->validateCity($userDiscountCoupon->cityId, $trip->getCityId());
        $this->validateTripPaymentForm($userDiscountCoupon->tripPaymentFormId, $trip->getTripPaymentFormId());

        if (dateIsBefore($userDiscountCoupon->dateEnd, now()))
            throw new DiscountCouponException(1702);

        $this->saveTripDiscountCoupon($userDiscountCouponId, $oldPrice, $trip->getTripReference());

        if ((bool)$userDiscountCoupon->bonusDriver)
            $this->createRewardDriver($oldPrice, $trip);
    }

    /**
     * @param $cityId
     * @param $tripCityId
     * @throws DiscountCouponException
     */
    private function validateCity($cityId, $tripCityId)
    {
        if ($cityId && $cityId != $tripCityId)
            throw new DiscountCouponException(1700);
    }

    /**
     * @param $couponTripPaymentFormId
     * @param $tripPaymentFormId
     * @throws DiscountCouponException
     */
    private function validateTripPaymentForm($couponTripPaymentFormId, $tripPaymentFormId)
    {
        if ($couponTripPaymentFormId && $couponTripPaymentFormId != $tripPaymentFormId)
            throw new DiscountCouponException(1705);
    }

    private function saveTripDiscountCoupon($userDiscountCouponId, $oldPrice, string $tripReference)
    {
        $tripDiscountCoupon = new TripDiscountCoupon;
        $tripDiscountCoupon
            ->setUserDiscountCouponId($userDiscountCouponId)
            ->setTripReference($tripReference)
            ->setOldPrice($oldPrice)
            ->setId(
                $this->tripDiscountCouponDao
                    ->sqlInsert($tripDiscountCoupon));
    }

    private function createRewardDriver($oldPrice, Trip $trip)
    {
        $reward = new RewardCampaignTrip;
        $reward
            ->setValue($oldPrice - $trip->getPrice())
            ->setTripReference($trip->getTripReference())
            ->setRewardTripTypeId(RewardTripTypeConst::REWARD_TRIP_DISCOUNT_COUPON)
            ->setId(
                $this->rewardCampaignTripDao
                    ->sqlInsert($reward)
            );

        return $reward;
    }
}