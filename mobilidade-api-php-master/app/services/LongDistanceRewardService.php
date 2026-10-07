<?php

namespace app\services;

use app\constant\RewardTripTypeConst;
use app\dao\PriceDao;
use app\dao\RewardTripDao;
use app\dao\TripDao;
use app\dao\TripLongDistanceValueDao;
use app\dao\ZoneDao;
use app\exceptions\PriceException;
use Exception;
use app\model\Price;
use app\model\RewardTrip;
use app\model\Trip;
use app\model\TripLongDistanceValue;
use app\model\Zone;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 26/02/2019
 * Time: 10:47
 */
class LongDistanceRewardService
{
    private $dao;
    private $tripDao;
    private $zoneDao;
    private $priceDao;

    /**
     * @var TripLongDistanceValueDao
     */
    private $tripLongDistanceValueDao;

    public function __construct()
    {
        $this->dao = new RewardTripDao;
        $this->tripDao = new TripDao;
        $this->zoneDao = new ZoneDao;
        $this->priceDao = new PriceDao;
        $this->tripLongDistanceValueDao = new TripLongDistanceValueDao;
    }

    /**
     * @param $distance
     * @param $driverId
     * @param \app\model\Trip $trip
     * @return RewardTrip|TripLongDistanceValue|null
     * @throws PriceException
     */
    public function insert($distance, $driverId, Trip $trip)
    {
        $tripReward = $this->findByTripAndDriver($trip->getTripReference(), $driverId);
        if ($tripReward)
            return $tripReward;

        $distanceInKm = $distance / 1000;

        $price = $this->getPrice($trip->getTripTypeId(), $trip->getCityId(), $trip->getPriceId());

        if (!$price->getLongDistanceRadius() || $distanceInKm <= $price->getLongDistanceRadius())
            return null;

        list($rewardValue, $kmDiff) = $this->calculateReward($price, $distanceInKm);

        if ((bool)$price->getLongDistanceValueToFinalPrice()) {
            return $this->createTripLongDistanceValue($trip, $driverId, $rewardValue, $kmDiff);
        }

        $tripReward = $this->create($rewardValue, $driverId, $trip->getTripReference());

        return $tripReward ?? null;
    }

    /**
     * @param $distance
     * @param $zoneId
     * @return null|\app\model\Zone
     */
    private function toAwardTrip($distance, $zoneId)
    {
        $zone = $this->getZone($zoneId);

        if ($zone->getLongDistanceRadius() && $distance > $zone->getLongDistanceRadius())
            return $zone;

        return null;
    }

    /**
     * Retorna um array com o valor no primeiro item e a diferença em km no segundo item
     * @param Price $price
     * @param $distance | In km
     * @return array
     */
    private function calculateReward(Price $price, $distance)
    {
        $kmDiff = $distance - $price->getLongDistanceRadius();

        return [$kmDiff * (float)$price->getLongDistancePerKm(), $kmDiff];
    }

    /**
     * @param $rewardValue
     * @param $driverId
     * @param $tripReference
     * @return RewardTrip
     */
    private function create($rewardValue, $driverId, $tripReference): ?RewardTrip
    {
        if ($rewardValue <= 0)
            return null;

        $rewardTrip = new RewardTrip;
        $rewardTrip
            ->setValue($rewardValue)
            ->setRewardTripTypeId(RewardTripTypeConst::REWARD_LONG_DISTANCE)
            ->setTripReference($tripReference)
            ->setDriverId($driverId)
            ->setId(
                $this->dao->sqlInsert($rewardTrip)
            );

//        $this->tripDao->setRewardTrip($tripReference, $rewardTrip->getId());

        return $rewardTrip;
    }

    /**
     * @param \app\model\Trip $trip
     * @return RewardTrip
     * @throws Exception
     */
    public function findAndUpdateRewardTrip(Trip $trip): ?RewardTrip
    {
        $rewardTrip = $this
            ->findByTripAndDriver($trip->getTripReference(), $trip->getDriverId());

        $this->tripDao->setRewardTrip(
            $trip->getTripReference(),
            $rewardTrip ? $rewardTrip->getId() : $rewardTrip
        );

        return $rewardTrip;
    }

    /**
     * @param $tripReference
     * @param $driverId
     * @return null|RewardTrip
     */
    private function findByTripAndDriver($tripReference, $driverId): ?RewardTrip
    {
        $rewardTrip = $this->dao
            ->findByTripAndDriver($tripReference, $driverId);

        if ($rewardTrip)
            return new RewardTrip($rewardTrip);

        return null;
    }

    /**
     * @param $tripTypeId
     * @param $cityId
     * @param null $priceId
     * @return \app\model\Price
     * @throws PriceException
     * @throws Exception
     */
    private function getPrice($tripTypeId, $cityId, $priceId = null): Price
    {
        $price = $priceId ?
            $this->priceDao
                ->findById($priceId) :
            $this->priceDao
                ->find($tripTypeId, $cityId);

        return $price;
    }

    /**
     * @param $cityId
     * @return Zone
     */
    private function getZone($cityId): Zone
    {
        $zone = new Zone(
            $this->zoneDao
                ->find($cityId)
        );

        return $zone;
    }

    /**
     * @param \app\model\Trip $trip
     * @param int $driverId
     * @param float $rewardValue
     * @param float $kmDiff
     * @return TripLongDistanceValue
     */
    private function createTripLongDistanceValue(
        Trip $trip, int $driverId, float $rewardValue, float $kmDiff): TripLongDistanceValue
    {
        $tripLongDistanceValueExists = $this->tripLongDistanceValueDao
            ->findByDriverAndTrip((int)$trip->getIdTrip(), $driverId);

        if ($tripLongDistanceValueExists)
            return new TripLongDistanceValue($tripLongDistanceValueExists);

        $tripLongDistanceValue = new TripLongDistanceValue;
        $tripLongDistanceValue
            ->setValue($rewardValue)
            ->setDriverId($driverId)
            ->setTripId($trip->getIdTrip())
            ->setKmDiff($kmDiff)
            ->setId($this->tripLongDistanceValueDao
                ->sqlInsert($tripLongDistanceValue));

        return $tripLongDistanceValue;
    }
}