<?php

namespace app\services;

use app\constant\TripTypeConst;
use app\dao\AdvertisingDao;
use app\dao\DynamicAreaDao;
use app\dao\LogDao;
use app\dao\PriceDao;
use app\dao\TollTripDao;
use app\dao\TripCancellationCustomerFeeDao;
use app\dao\TripDao;
use app\dao\TripTypeDao;
use app\exceptions\PriceException;
use app\model\Tax;
use app\services\contracts\PriceService;
use app\traits\CommissionTrait;
use app\model\Cashback;
use app\model\Config;
use Exception;
use app\model\Location;
use app\model\Price;
use stdClass;
use app\model\Trip;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 10/05/2019
 * Time: 08:43
 */
class PriceCustomerService extends PriceService
{
    use CommissionTrait;

    /**
     * @param \app\model\Location $startLocation
     * @param \app\model\Location $endLocation
     * @param $tripTypeId
     * @param array|null $waypoints
     * @return float|int|mixed
     * @throws PriceException
     * @throws Exception
     */
    public function getTripPrice(Location $startLocation, Location $endLocation, $tripTypeId, ?array $waypoints = [])
    {
        $this->findCityId($startLocation->getLatitude(), $startLocation->getLongitude());

        $this->waypointsIsValid($waypoints ?? []);

        $estimative = $this->calculateEstimative($startLocation, $endLocation, $waypoints);

        $tolls = $this->findTollIfCrosses($estimative->overview_polyline->points);

        $this->price = $price = $this->getPriceByCityAreaAndTripType(
            $startLocation, $this->convertMetersInKm($estimative->distance), $tripTypeId);

        $taxes = (new TaxService())->findActivesByCityAndTripTypePaidByCustomer($this->price->getCityId(), $this->price->getTripTypeId());

        $ads = (new AdvertisingDao)
            ->findByCoordinate($startLocation->getLatitude(), $startLocation->getLongitude(), false);

        $cancellationFee = $this->searchCancellationFee();
        $cashback = $this->findCashback($startLocation, $tripTypeId);
        $this->countLongDistanceDelivery($startLocation, $endLocation, $waypoints);

        $dynamicArea = (new DynamicAreaDao)->findByPosition($startLocation->getLatitude(), $startLocation->getLongitude(), date('H:i:s'));

        $multiplierDynamicPrice = $price->getMultiplierValue() ? (float)$price->getMultiplierValue() : null;

        if ($dynamicArea) {
            $multiplierDynamicPrice = (float)$dynamicArea->multiplierValue;
        }

        $calculatedPrice =
            $this->calculatePrice(
                $estimative->distance,
                $estimative->duration,
                $multiplierDynamicPrice,
                $waypoints,
                $taxes
            ) + $cancellationFee;

        $sumTolls = array_sum(array_map(function ($toll) {
            return $toll->value;
        }, $tolls));

        $calculatedPrice += ($sumTolls ?? 0);

        $this->storeQuery($startLocation, $endLocation, $price, $calculatedPrice);

        $priceRange = $this->findNewPriceByCityAndTripType(
            $price->getCityId(), $price->getTripTypeId(), $calculatedPrice);

        $calculatedPrice = $priceRange ? $priceRange['new_value'] : $calculatedPrice;
        $cashbackValue = 0;

        if ($cashback instanceof Cashback) {
            $cashbackValue += $this->getValueByType(
                $cashback->getValueType(), $cashback->getValue(), $calculatedPrice);

            if ((bool)$cashback->getAddToFinalPrice())
                $calculatedPrice += $cashbackValue;
        }

        $senacon = (new SenaconPriceBreakdownService)->build(
            $price->getCityId(), $price->getTripTypeId(), $calculatedPrice
        );

        return [
            'ads' => $ads,
            'price' => [
                'idPrice' => $price->getId(),
                'price' => round($calculatedPrice, 2),
                'platformAmount' => $senacon['platformAmount'],
                'driverAmount' => $senacon['driverAmount'],
                'tripTypeId' => $price->getTripTypeId(),
                'tripType' => (new TripTypeDao)->findById($price->getTripTypeId()),
                'typeDrivers' => $this->tripTypeDriverService->findDriverTypes($price->getTripTypeId()),
                'priceName' => $price->getName(),
                'tag' => $price->getDynamicTag() ? $price->getDynamicTag() : $price->getTag(),
                'color' => $price->getColor(),
                'cancellationFee' => $cancellationFee,
                'priceRange' => $priceRange,
                'multiplierPriceDynamic' => $price->getMultiplierValue() ?
                    number_format(
                        $price->getMultiplierValue(), 2, '.', ''
                    ) . "x" : null,
                'order' => $price->getOrder(),
                'accessibility' => (bool)$price->getFreightOption() ? [
                    'priceObstacle' => $this->priceObstacleDao->findByCity($price->getCityId()),
                    'priceHelp' => $this->priceHelpDao->findByCity($price->getCityId()),
                ] : null,
                'cashback' => $cashback instanceof Cashback ? [
                    'id' => $cashback->getId(),
                    'cashbackValue' => round($cashbackValue, 2),
                ] : null,
                'taxes' => array_map(function (Tax $tax) {
                    return $tax->getId();
                }, $taxes),
            ],
            'overview_polyline' => $estimative->overview_polyline,
            'distance' => $this->getFormattedDistance($estimative->distance),
            'duration' => $this->getFormattedTime($estimative->duration),
        ];
    }

    /**
     * Retorna as categorias (tripTypes) elegíveis para a localização, aplicando a mesma
     * regra de área/status/onlyCentral/openPrice usada em getAllTripPrices, mas sem calcular
     * preço e sem chamar o Directions (não depende de distance/duration).
     *
     * @param \app\model\Location $origin
     * @param bool|null $onlyCentral
     * @param bool|null $noDestination
     * @return array
     * @throws PriceException
     */
    public function getAvailableTripTypes(Location $origin, ?bool $onlyCentral = false, ?bool $noDestination = false)
    {
        $prices = $this->getPricesByCityArea($origin, null, null, $onlyCentral, $noDestination);

        return array_map(function (Price $price) {
            return [
                'idPrice' => $price->getId(),
                'tripTypeId' => $price->getTripTypeId(),
                'tripType' => (new TripTypeDao)->findById($price->getTripTypeId()),
                'typeDrivers' => $this->tripTypeDriverService->findDriverTypes($price->getTripTypeId()),
                'priceName' => $price->getName(),
                'description' => $price->getDescription(),
                'picture' => $price->getPicture(),
                'tag' => $price->getDynamicTag() ?: $price->getTag(),
                'color' => $price->getColor(),
                'order' => $price->getOrder(),
            ];
        }, $prices);
    }

    public function getAllTripPrices(
        Location $startLocation, Location $endLocation, ?array $waypoints = null, ?string $time = null, ?bool $onlyCentral = false, ?bool $noDestination = false, $timeCurrent = null)
    {
        $this->findCityId($startLocation->getLatitude(), $startLocation->getLongitude());

        $this->waypointsIsValid($waypoints ?? []);

        $estimative = $this->calculateEstimative($startLocation, $endLocation, $waypoints);

        if (empty($estimative->overview_polyline->points)) {
            $exception = new PriceException(102, [
                'estimative' => $estimative,
                'location' => [
                    'start' => $startLocation->toStdClass(),
                    'end' => $endLocation->toStdClass(),
                ],
                'waypoints' => $waypoints,
            ]);
            (new LogDao)->logException($exception);

            throw $exception;
        }

        $tolls = $this->findTollIfCrosses($estimative->overview_polyline->points);

        $prices = $this->getPricesByCityArea(
            $startLocation, $this->convertMetersInKm($estimative->distance), $time, $onlyCentral, $noDestination);

        $cancellationFee = $this->searchCancellationFee();
        $this->countLongDistanceDelivery($startLocation, $endLocation, $waypoints);

        $ads = (new AdvertisingDao)
            ->findByCoordinate($startLocation->getLatitude(), $startLocation->getLongitude(), false);

        $dynamicArea = null;

        if ($timeCurrent) {
             $dynamicArea = (new DynamicAreaDao)->findByPosition($startLocation->getLatitude(), $startLocation->getLongitude(), $timeCurrent);
        }

        $senaconService = new SenaconPriceBreakdownService;

        $prices = array_map(function (Price $price) use (
            $estimative,
            $startLocation,
            $endLocation,
            $cancellationFee,
            $waypoints,
            &$competitivePrice,
            $tolls,
            $dynamicArea,
            $senaconService
        ) {
            $this->price = $price;

            $taxes = (new TaxService())->findActivesByCityAndTripTypePaidByCustomer($price->getCityId(), $price->getTripTypeId());

            $competitivePrice = null;

            $cashback = $this->findCashback($startLocation, $price->getTripTypeId());

            $multiplierDynamicPrice = $price->getMultiplierValue() ? (float)$price->getMultiplierValue() : null;

            if ($dynamicArea) {
                $multiplierDynamicPrice = (float)$dynamicArea->multiplierValue;
            }

            $calculatedPrice =
                $this->calculatePrice(
                    $estimative->distance,
                    $estimative->duration,
                    $multiplierDynamicPrice,
                    $waypoints,
                    $taxes
                ) + $cancellationFee;

            $competitivePrice = empty($waypoints) ?
                $this->getCompetitivePrice($price, $startLocation, $endLocation) :
                null;

            $calculatedPrice = $competitivePrice && $calculatedPrice > $competitivePrice ?
                (
                ($competitivePrice - $price->getSubtractionCompetitivePrice()) < $price->getMinPrice() ?
                    $price->getMinPrice() :
                    ($competitivePrice - $price->getSubtractionCompetitivePrice())
                ) :
                $calculatedPrice;

            $sumTolls = array_sum(array_map(function ($toll) {
                return $toll->value;
            }, $tolls));

            $calculatedPrice += ($sumTolls ?? 0);

            $this->storeQuery($startLocation, $endLocation, $price, $calculatedPrice, $competitivePrice);

            $priceRange = $this->findNewPriceByCityAndTripType(
                $price->getCityId(), $price->getTripTypeId(), $calculatedPrice);

            $calculatedPrice = $priceRange ? $priceRange['new_value'] : $calculatedPrice;
            $cashbackValue = 0;

            if ($cashback instanceof Cashback) {
                $cashbackValue += $this->getValueByType(
                    $cashback->getValueType(), $cashback->getValue(), $calculatedPrice);

                if ((bool)$cashback->getAddToFinalPrice())
                    $calculatedPrice += $cashbackValue;
            }

            $senacon = $senaconService->build(
                $price->getCityId(), $price->getTripTypeId(), $calculatedPrice
            );

            return [
                'idPrice' => $price->getId(),
                'price' => round($calculatedPrice, 2),
                'platformAmount' => $senacon['platformAmount'],
                'driverAmount' => $senacon['driverAmount'],
                'tripTypeId' => $price->getTripTypeId(),
                'tripType' => (new TripTypeDao)->findById($price->getTripTypeId()),
                'typeDrivers' => $this->tripTypeDriverService->findDriverTypes($price->getTripTypeId()),
                'priceName' => $price->getName(),
                'description' => $price->getDescription(),
                'picture' => $price->getPicture(),
                'tag' => $price->getDynamicTag() ?: $price->getTag(),
                'color' => $price->getColor(),
                'cancellationFee' => $cancellationFee,
                'priceRange' => $priceRange,
                'multiplierPriceDynamic' => $multiplierDynamicPrice ?
                    number_format(
                        $multiplierDynamicPrice, 2, '.', ''
                    ) . "x" : null,
                'priceDynamicValue' => round($multiplierDynamicPrice, 2),
                'order' => $price->getOrder(),
                'cashback' => $cashback instanceof Cashback ? [
                    'id' => $cashback->getId(),
                    'cashbackValue' => round($cashbackValue, 2),
                ] : null,
                'taxes' => array_map(function (Tax $tax) {
                    return $tax->getId();
                }, $taxes),
            ];
        }, $prices);

        return [
            'ads' => $ads,
            'prices' => $prices,
            'distance' => $this->getFormattedDistance($estimative->distance),
            'duration' => $this->getFormattedTime($estimative->duration),
            'overview_polyline' => $estimative->overview_polyline,
            'hasDiscountCoupon' => $this->hasDiscountCoupon(),
            'tolls' => $tolls,
            'label_info' => [
                'title_trip_types' => Config::get('title_trip_types'),
                'description_trip_types' => Config::get('description_trip_types')
            ]
        ];
    }

    /**
     * @param stdClass $request
     * @return array
     * @throws PriceException
     */
    public function findFare(stdClass $request)
    {
        if (!isset($request->lat, $request->lng))
            throw new Exception("Coordenadas não enviadas");

        if (!isset($request->tripTypeId))
            throw new Exception("Tipos de chamado não enviado");

        $location = new Location;
        $location->setLatitude($request->lat);
        $location->setLongitude($request->lng);

        $price = $this->getPriceByCityAreaAndTripType($location, 0, $request->tripTypeId);

        return $price->toArray();
    }

    private function getCompetitivePrice(Price $price, Location $origin, Location $destination)
    {
        if ($price->getTripTypeId() == TripTypeConst::RETURN &&
            (boolean)$price->getComparisionPrice())

            return $this->getUberPrice(
                $origin->getLatitude(), $origin->getLongitude(),
                $destination->getLatitude(), $destination->getLongitude()
            );

        return null;
    }

    /**
     * @param $userId
     * @return object
     */
    public function searchCancellationFree($userId)
    {

        return (object)['value' => $this->searchCancellationFee($userId)];
    }


    public function previewNewPriceInChangeRoute($tripReference, $destination, $waypoint = [], $kmProgressing = 0, $minuteProgressing = 0, $timeCurrent = null, $multiplierDynamicPrice = null)
    {
        $trip = (new TripDao)->find($tripReference);

        $distance = 0;
        $duration = 0;

        $estimative = null;

        $startLocation = null;

        switch ($trip->status) {
            case Trip::PRE_ACCEPTED :
            case Trip::ACCEPTED :
            case Trip::BOARDING :
                $startLocation = new Location($trip->origin);
                $estimative = $this->calculateEstimative($startLocation, new Location($destination), $waypoint);
                $distance = $estimative->distance;
                $duration = $estimative->duration;
                break;
            case Trip::IN_PROGRESS :
                $startLocation = new Location($trip->driver->location);
                $estimative = $this->calculateEstimative($startLocation, new Location($destination), $waypoint);
                $distance = $estimative->distance + ($kmProgressing * 1000);
                $duration = $estimative->duration + ($minuteProgressing * 60);
                break;
        }

        $price = new Price((new PriceDao)->findById($trip->priceId));

        $this->price = $price;

        $tolls = (new TollTripDao)->findByTrip($trip->idTrip);

        $taxes = (new TaxService)->findByTrip($trip->idTrip);

        $cancellationCustomerFee = (new TripCancellationCustomerFeeDao)->findByTrip($tripReference);

        $cancellationCustomerFeeValue = 0;

        if ($cancellationCustomerFee) {
            $cancellationCustomerFeeValue = $cancellationCustomerFee->feeValue;
        }

        $dynamicArea = null;

        if ($timeCurrent) {
            $dynamicArea = (new DynamicAreaDao)->findByPosition($startLocation->getLatitude(), $startLocation->getLongitude(), $timeCurrent);
        }

        if ($dynamicArea) {
            $multiplierDynamicPrice = (float)$dynamicArea->multiplierValue;
        }

        $calculatedPrice =
            $this->calculatePrice(
                $distance,
                $duration,
                $multiplierDynamicPrice,
                $waypoint,
                $taxes
            ) + $cancellationCustomerFeeValue;

        $sumTolls = array_sum(array_map(function ($toll) {
            return $toll->value;
        }, $tolls));

        $calculatedPrice += ($sumTolls ?? 0);

        $priceRange = $this->findNewPriceByCityAndTripType(
            $price->getCityId(), $price->getTripTypeId(), $calculatedPrice);

        $calculatedPrice = $priceRange ? $priceRange['new_value'] : $calculatedPrice;

        $cashback = $this->findCashback(new Location($trip->origin), $price->getTripTypeId());
        $cashbackValue = 0;

        if ($cashback instanceof Cashback) {
            $cashbackValue += $this->getValueByType(
                $cashback->getValueType(), $cashback->getValue(), $calculatedPrice);

            if ((bool)$cashback->getAddToFinalPrice())
                $calculatedPrice += $cashbackValue;
        }

        $senacon = (new SenaconPriceBreakdownService)->build(
            $price->getCityId(), $price->getTripTypeId(), $calculatedPrice
        );

        return (object)[
            'price' => round($calculatedPrice, 2),
            'platformAmount' => $senacon['platformAmount'],
            'driverAmount' => $senacon['driverAmount'],
            'distance' => $distance,
            'duration' => $duration,
            'polyline' => $estimative->overview_polyline
        ];
    }

    public function getWaitingTimeFees($request)
    {
        $price = (new PriceDao)->getWaitingTimeFees($request);
        return $price;
    }
}