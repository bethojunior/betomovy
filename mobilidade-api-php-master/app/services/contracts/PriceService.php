<?php

namespace app\services\contracts;

use app\constant\PriceConst;
use app\dao\CalculatedTripPriceDao;
use app\dao\CashbackDao;
use app\dao\CityConfigDao;
use app\dao\PriceDao;
use app\dao\PriceHelpDao;
use app\dao\PriceObstacleDao;
use app\dao\PriceRangeCentralDao;
use app\dao\PriceRangeDao;
use app\dao\ro\customer\TripCancellationCustomerFeeRoDao;
use app\dao\ro\customer\UserDiscountCouponRoDao;
use app\dao\TollDao;
use app\exceptions\PriceException;
use app\model\CalculatedTripPrice;
use app\model\Cashback;
use app\model\CityConfig;
use app\model\Location;
use app\model\Price;
use app\model\Tax;
use app\queue\Jobs\InsertQueueJob;
use app\queue\Queue;
use app\services\CityConfigService;
use app\services\PriceDynamicService;
use app\services\TripTypeDriverService;
use app\utils\DirectionService;
use app\utils\Headers;
use Exception;
use Polyline;
use stdClass;

/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 11/09/2018
 * Time: 11:45
 */
abstract class PriceService
{
    const SUBTRACTION_COMPETITIVE_PRICE = 1;

    /** @var Price $price */
    protected $price;
    protected $cityId;
    protected $tripTypeId;
    protected $priceDynamicService;
    protected $tripTypeDriverService;
    protected $cityConfigService;
    protected $tripCancellationCustomerFeeDao;
    /** @var CityConfig|null */
    protected $cityConfig;
    protected $cityConfigDao;
    protected $priceObstacleDao;
    protected $priceHelpDao;

    protected $quantityLongDistanceDelivery = 0;

    private $calculatedPriceDao;
    private $userDiscountCouponDao;
    private $cashbackDao;

    /**
     * PriceService constructor.
     */
    public function __construct()
    {
        $this->priceDynamicService = new PriceDynamicService;
        $this->tripTypeDriverService = new TripTypeDriverService;
        $this->cityConfigService = new CityConfigService;
        $this->tripCancellationCustomerFeeDao = new TripCancellationCustomerFeeRoDao;
        $this->calculatedPriceDao = new CalculatedTripPriceDao;
        $this->cityConfigDao = new CityConfigDao;
        $this->priceObstacleDao = new PriceObstacleDao;
        $this->priceHelpDao = new PriceHelpDao;
        $this->userDiscountCouponDao = new UserDiscountCouponRoDao;
        $this->cashbackDao = new CashbackDao;
    }

    /**
     * @param Price $price
     * @return $this
     */
    public function setPrice(Price $price)
    {
        $this->price = $price;

        return $this;
    }

    /**
     * @return Price
     */
    public function getPrice(): Price
    {
        return $this->price;
    }

    /**
     * @param mixed $cityId
     * @return PriceService
     */
    public function setCityId($cityId)
    {
        $this->cityId = $cityId;
        return $this;
    }

    /**
     * @param int $tripTypeId
     * @return PriceService
     */
    public function setTripTypeId(int $tripTypeId): PriceService
    {
        $this->tripTypeId = $tripTypeId;
        return $this;
    }

    /**
     * @param \app\model\Location $origin
     * @param $trip_distance
     * @param string|null $time
     * @param bool|null $onlyCentral
     * @param bool|null $noDestination
     * @return array
     * @throws PriceException
     */
    protected function getPricesByCityArea(
        Location $origin,
        $trip_distance = null,
        ?string $time = null,
        ?bool $onlyCentral = false,
        ?bool $noDestination = false
    ) {
        $prices = (new PriceDao)->findByCityArea($origin, $trip_distance, $time, $onlyCentral, $noDestination);

        if (!$prices)
            throw new PriceException(100);

        return array_map(function ($price) {
            return new Price($price);
        }, $prices);
    }

    /**
     * @param \app\model\Location $origin
     * @param $trip_distance
     * @param $tripTypeId
     * @return Price
     * @throws PriceException
     */
    protected function getPriceByCityAreaAndTripType(Location $origin, $trip_distance, $tripTypeId)
    {
        $price = (new PriceDao)->findByCityAreaAndTripType($origin, $trip_distance, $tripTypeId);

        if (!$price)
            throw new PriceException(100);

        return new Price($price);
    }

    /**
     * @param \app\model\Location $startLocation
     * @param Location $endLocation
     * @param array|null $waypoints
     * @return stdClass
     * @throws Exception
     */
    protected function calculateEstimative(Location $startLocation, Location $endLocation, ?array $waypoints = null)
    {
        $estimative = (new DirectionService)
            ->getDistance(
                $startLocation->getLatitude(),
                $startLocation->getLongitude(),
                $endLocation->getLatitude(),
                $endLocation->getLongitude(),
                $waypoints
            );

        return $estimative;
    }

    /**
     * @param $start_latitude
     * @param $start_longitude
     * @param $end_latitude
     * @param $end_longitude
     * @return float|int|null
     */
    protected function getUberPrice($start_latitude, $start_longitude, $end_latitude, $end_longitude)
    {
        return null;
        //        try {
        //            return UberApi::getPrice($start_latitude,
        //                $start_longitude,
        //                $end_latitude,
        //                $end_longitude);
        //        } catch (UberException $e) {
        //            return null;
        //        }
    }

    /**
     * @param $distance
     * @param $estimated_time
     * @param null $multiplierDynamicPrice
     * @param array $waypoint
     * @param array $taxes
     * @return float|int|mixed
     */
    protected function calculatePrice(
        $distance,
        $estimated_time,
        $multiplierDynamicPrice = null,
        $waypoint = [],
        array $taxes = []
    ) {
        $distance_in_km = $this->getFormattedDistance($distance);

        $base_price = $this->price->getBasePrice();
        $km_price = $distance_in_km * $this->price->getKmPrice();
        $minute_price = $this->getFormattedTime($estimated_time) * $this->price->getMinutePrice();

        $quantityWayPoints = count($waypoint);

        $price =
            $base_price +
            $km_price +
            $minute_price;

        $taxPrice = $this->price->getTaxPriceType() === '%' ? $price * $this->price->getTaxPrice() / 100 : $this->price->getTaxPrice();
        $anotherFee = $this->price->getAnotherFeeType() === '%' ? $price * $this->price->getAnotherFee() / 100 : $this->price->getAnotherFee();

        $taxesValues = array_map(function (Tax $tax) use ($price) {
            return $tax->getValueType() === '%' ? $price * $tax->getValue() / 100 : $tax->getValue();
        }, $taxes);


        $price += array_sum($taxesValues) + $taxPrice + $anotherFee;

        if (
            $this->price->getKmToAdditionalValue() > 0 &&
            $distance_in_km > $this->price->getKmToAdditionalValue()
        )
            switch ($this->price->getTypeAdditionalValueAfterKm()) {
                case '$':
                    $price += $this->price->getAdditionalValueAfterKm();
                    break;
                case 'km':
                    $price +=
                        ($this->price->getAdditionalValueAfterKm() * ($distance_in_km - $this->price->getKmToAdditionalValue()));
                    break;
            }

        $price = $price < $this->price->getMinPrice() ? $this->price->getMinPrice() : $price;

        $price += ($this->price->getWaypointPrice() * $quantityWayPoints);
        $price += ($this->quantityLongDistanceDelivery * $this->price->getLongDistanceDeliveryPrice());

        if (
            $quantityWayPoints == 0 &&
            $this->price->getPromotionalPriceTemp() > 0 &&
            $this->price->getMinPrice() == $price
        )
            $price = $this->price->getPromotionalPriceTemp();

        return $multiplierDynamicPrice ? $price * $multiplierDynamicPrice : $price;
    }

    /**
     * @param float $distance
     * Distance in meters
     *
     * @throws Exception
     */
    protected function distanceIsValid(float $distance)
    {
        if ($this->getFormattedDistance($distance) > PriceConst::LIMIT_DISTANCE_IN_KM)
            throw new Exception("Distancia ultrapassa o limite de viagem permitido");
    }

    /**
     * @param array|null $waypoints
     * @throws PriceException
     */
    protected function waypointsIsValid(?array $waypoints = [])
    {
        if ($waypoints && $this->getCityConfig()->getQuantityTripWayPoints() < count($waypoints))
            throw new PriceException(101, ['waypointsNumber' => count($waypoints)]);
    }

    protected function findCityId($lat, $lng)
    {
        $cityConfig = $this->cityConfigService
            ->getCityByCoordinates($lat, $lng);

        if (isset($cityConfig->cityId)) {
            $this->cityId = $cityConfig->cityId;
        } elseif (empty($this->cityId)) {
            $this->cityId = 1;
        }
    }

    /**
     * @param \app\model\Location $origin
     * @param $tripTypeId
     * @return Cashback|null
     */
    protected function findCashback(Location $origin, $tripTypeId): ?Cashback
    {
        $cashback = $this->cashbackDao
            ->findByCoordinateAndTripType($origin->getLatitude(), $origin->getLongitude(), $tripTypeId);

        return !$cashback ? null : new Cashback($cashback);
    }

    protected function getCityConfig(): CityConfig
    {
        $this->cityConfig = $this->cityConfig ?? $this->cityConfigService
            ->getByCity($this->cityId);

        return $this->cityConfig;
    }

    protected function findNewPriceByCityAndTripType($cityId, $tripTypeId, $value)
    {
        $priceRange = (new PriceRangeDao)
            ->findNewPriceByCityAndTripType($cityId, $tripTypeId, $value);

        if (empty($priceRange))
            return null;

        return [
            'new_value' => $priceRange->new_value,
            'min_value' => $priceRange->min_value,
            'max_value' => $priceRange->max_value,
            'description' => $priceRange->description,
        ];
    }

    /**
     * Retorna a distancia em km
     * @param $distanceInMeters
     * @return float|int
     */
    protected function getFormattedDistance($distanceInMeters)
    {
        return $distanceInMeters / 1000;
    }

    /**
     * Retorna o tempo em minutos
     * @param $distanceInSeconds
     * @return float|int
     */
    protected function getFormattedTime($distanceInSeconds)
    {
        return (int)($distanceInSeconds / 60);
    }

    protected function searchCancellationFee($userId = null, $isCentral = null)
    {
        if (is_null($userId))
            $userId = Headers::getUserId();

        $cancellationFee = 0;

        if (!$userId || $isCentral == true)
            return $cancellationFee;

        $cancellationFees = $this->tripCancellationCustomerFeeDao
            ->findByUser($userId);

        foreach ($cancellationFees as $fee) {
            $cancellationFee += $fee->feeValue;
        }

        return $cancellationFee;
    }

    protected function hasDiscountCoupon()
    {
        $userId = Headers::getUserId();
        $hasDiscountCoupon = false;

        if (!$userId)
            return $hasDiscountCoupon;

        $coupons = $this->userDiscountCouponDao
            ->findByUser($userId);

        return !empty($coupons);
    }

    /**
     * @param Location $origin
     * @param \app\model\Location $destination
     * @param Price $price
     * @param $calculatedValue
     * @param null $competitivePrice
     * @return CalculatedTripPrice
     */
    protected function storeQuery(
        Location $origin,
        Location $destination,
        Price $price,
        $calculatedValue,
        $competitivePrice = null
    ): CalculatedTripPrice {
        $calculatedPrice = new CalculatedTripPrice;
        $calculatedPrice
            ->setOriginLatitude($origin->getLatitude())
            ->setOriginLongitude($origin->getLongitude())
            ->setOriginAddress($origin->getAddress())
            ->setDestinationLatitude($destination->getLatitude())
            ->setDestinationLongitude($destination->getLongitude())
            ->setDestinationAddress($destination->getAddress())
            ->setPriceId($price->getId())
            ->setPrice($calculatedValue)
            ->setTripTypeId($price->getTripTypeId())
            ->setUserId(Headers::getUserId())
            ->setMultiplierValue($price->getMultiplierValue())
            ->setCompetitivePrice($competitivePrice);


        $queue = Queue::dispatch(
            InsertQueueJob::class,
            [
                'tableToInsert' => 'calculatedTripPrice',
                'data' => $calculatedPrice->toArray()
            ]
        );

        return $calculatedPrice;
    }

    /**
     * @param $distanceInMeters
     * @return float|int
     */
    protected function convertMetersInKm($distanceInMeters)
    {
        return $distanceInMeters / 1000;
    }

    /**
     * @param Location $origin
     * @param \app\model\Location $destination
     * @param array|null $waypoints
     */
    protected function countLongDistanceDelivery(Location $origin, Location $destination, ?array $waypoints = []): void
    {
        if ($origin->getLongDistanceDelivery() == true)
            $this->quantityLongDistanceDelivery++;

        if ($destination->getLongDistanceDelivery() == true)
            $this->quantityLongDistanceDelivery++;

        foreach ($waypoints as $waypoint) {
            if (isset($waypoint->longDistanceDelivery))
                $this->quantityLongDistanceDelivery++;
        }
    }

    /**
     * @param string $stringPolyline
     * @return string
     */
    protected function convertEncodePolylineToLineString(string $stringPolyline): string
    {
        $polyline = Polyline::decode($stringPolyline);
        $coordinates = [];

        for ($i = 0; $i < count($polyline); $i = $i + 2) {
            $coordinates[] = "{$polyline[$i]} {$polyline[$i + 1]}";
        }

        if (count($coordinates) == 1)
            $coordinates[] = $coordinates[0];

        return "LINESTRING(" . implode(",", $coordinates) . ")";
    }

    /**
     * @param string $polyline
     * @return array|mixed
     */
    protected function findTollIfCrosses(string $polyline): array
    {
        return (new TollDao)
            ->findByLinestring($this->convertEncodePolylineToLineString($polyline));
    }

    protected function findNewPriceByCityAndTripTypeAndCentral($cityId, $tripTypeId, $value, $centralId)
    {
        $priceRange = (new PriceRangeCentralDao)
            ->findNewPriceByCityAndTripTypeAndCentral($cityId, $tripTypeId, $value, $centralId);

        if (empty($priceRange))
            return null;

        return [
            'new_value' => $priceRange->new_value,
            'min_value' => $priceRange->min_value,
            'max_value' => $priceRange->max_value,
            'description' => $priceRange->description,
        ];
    }
}
