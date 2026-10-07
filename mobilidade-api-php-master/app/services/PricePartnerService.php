<?php

namespace app\services;

use app\constant\CommissionTypeConst;
use app\dao\AdvertisingDao;
use app\dao\PartnerCommissionDao;
use app\dao\ro\partner\PartnerCommissionRoDao;
use app\dao\TripTypeDao;
use app\exceptions\PartnerCommissionException;
use app\exceptions\PriceException;
use app\services\contracts\PriceService;
use app\traits\CommissionTrait;
use app\utils\Headers;
use app\validator\PricePartnerValidator;
use app\model\Cashback;
use app\model\Config;
use Exception;
use app\model\Location;
use app\model\PartnerCommission;
use app\model\Price;
use app\model\Tax;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 10/05/2019
 * Time: 09:10
 */
class PricePartnerService extends PriceService
{
    private $validator;
    private $partnerCommissionDao;

    use CommissionTrait;

    public function __construct()
    {
        $this->validator = new PricePartnerValidator;
        $this->partnerCommissionDao = new PartnerCommissionRoDao;
        parent::__construct();
    }

    /**
     * @param $request
     * @return array
     * @throws PriceException
     * @throws Exception
     */
    public function calculateAllPrice($request)
    {
        $this->validateCalculateAllPricesRequest($request);

        $origin = new Location($request->origin);
        $destination = new Location($request->destination);

        $cancellationFee = $this->searchCancellationFee(null, $request->isCentral ?? null);

        $estimative = $this->calculateEstimative($origin, $destination, $request->waypoints ?? null);

        $tolls = $this->findTollIfCrosses($estimative->overview_polyline->points);

        $prices = $this->getPricesByCityArea(
            $origin, $this->convertMetersInKm($estimative->distance), null, $request->onlyCentral ?? null);

        $partnerCommission = $this->findCommissionByUser();

        $ads = (new AdvertisingDao)
            ->findByCoordinate($origin->getLatitude(), $origin->getLongitude(), false);

        $senaconService = new SenaconPriceBreakdownService;

        $prices = array_map(function (Price $price) use (
            $estimative,
            $cancellationFee,
            $partnerCommission,
            $origin,
            $destination,
            $request,
            $tolls,
            $senaconService
        ) {
            $this->price = $price;

            $taxes = (new TaxService())->findActivesByCityAndTripTypePaidByCustomer($price->getCityId(), $price->getTripTypeId());

            $cashback = $this->findCashback($origin, $price->getTripTypeId());

            $calculatedPrice =
                $this->calculatePrice(
                    $estimative->distance,
                    $estimative->duration,
                    $price->getMultiplierValue() ?
                        (float)$price->getMultiplierValue() : null,
                    $request->waypoints ?? [],
                    $taxes
                ) + $cancellationFee;

            $sumTolls = array_sum(array_map(function ($toll) {
                return $toll->value;
            }, $tolls));

            $calculatedPrice += ($sumTolls ?? 0);

            if (isset($request->centralId)) {
                $priceRange = $this->findNewPriceByCityAndTripTypeAndCentral(
                    $price->getCityId(), $price->getTripTypeId(), $calculatedPrice, $request->centralId
                );

                if (empty($priceRange)) {
                    $priceRange = $this->findNewPriceByCityAndTripType(
                        $price->getCityId(), $price->getTripTypeId(), $calculatedPrice
                    );
                }
            } else {
                $priceRange = $this->findNewPriceByCityAndTripType(
                    $price->getCityId(), $price->getTripTypeId(), $calculatedPrice
                );
            }
            $calculatedPrice = $priceRange ? $priceRange['new_value'] : $calculatedPrice;

            $partnerValue = $this->calculatePartnerCommission($calculatedPrice, $partnerCommission);
            $cashbackValue = 0;

            if ($cashback instanceof Cashback && (bool)$cashback->getAddToFinalPrice())
                $cashbackValue += $this->getValueByType(
                    $cashback->getValueType(), $cashback->getValue(), $calculatedPrice);

            $this->storeQuery($origin, $destination, $price, $calculatedPrice);

            $totalPriceForBreakdown = round(($calculatedPrice + $partnerValue), 2);
            $senacon = $senaconService->build(
                $price->getCityId(),
                $price->getTripTypeId(),
                $totalPriceForBreakdown,
                (float)$partnerValue
            );

            return [
                'idPrice' => $price->getId(),
                'price' => $totalPriceForBreakdown,
                'platformAmount' => $senacon['platformAmount'],
                'driverAmount' => $senacon['driverAmount'],
                'partnerCommission' => round((float)$partnerValue, 2),
                'tripTypeId' => $price->getTripTypeId(),
                'tripType' => (new TripTypeDao)->findById($price->getTripTypeId()),
                'typeDrivers' => $this->tripTypeDriverService->findDriverTypes($price->getTripTypeId()),
                'priceName' => $price->getName(),
                'description' => $price->getDescription(),
                'picture' => $price->getPicture(),
                'tag' => $price->getDynamicTag() ?: $price->getTag(),
                'color' => $price->getColor(),
                'cancellationFee' => $cancellationFee,
                'multiplierPriceDynamic' => $price->getMultiplierValue() ?
                    $price->getMultiplierValue() . "x" : null,
                'priceDynamicValue' => $price->getMultiplierValue() ?
                    round($price->getMultiplierValue(), 2) : null,
                'cashback' => $cashbackValue > 0 ? [
                    'id' => $cashback->getId(),
                    'cashbackValue' => round($cashbackValue, 2)
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
            'tolls' => $tolls,
            'label_info' => [
                'title_trip_types' => Config::get('title_trip_types'),
                'description_trip_types' => Config::get('description_trip_types')
            ]
        ];
    }

    /**
     * @param null $userId
     * @return null|PartnerCommission
     */
    public function findCommissionByUser($userId = null)
    {
        $commission = $this->partnerCommissionDao
            ->findByUser(Headers::getUserId() ?? $userId);

        if ($commission)
            return new PartnerCommission($commission);

        return null;
    }

    /**
     * @param $calculatedPrice
     * @param null|\app\model\PartnerCommission $partnerCommission
     * @return float|int
     * @throws PartnerCommissionException
     */
    private function calculatePartnerCommission($calculatedPrice, ?PartnerCommission $partnerCommission)
    {
        if (!$partnerCommission)
            return 0;

        $partnerValue = $this->getValueByType(
            $partnerCommission->getPartnerCommissionType(),
            $partnerCommission->getPartnerCommissionValue(),
            $calculatedPrice);

        $managerValue = $this->getValueByType(
            $partnerCommission->getManagerCommissionType(),
            $partnerCommission->getManagerCommissionValue(),
            $calculatedPrice);

        $appValue = $this->getValueByType(
            $partnerCommission->getAppCommissionType(),
            $partnerCommission->getAppCommissionValue(),
            $calculatedPrice);

        return ($partnerValue + $managerValue + $appValue);
    }

    /**
     * @param $type
     * @param $commissionValue
     * @param $grossValue
     * @return float|int
     * @throws PartnerCommissionException
     */
    private function getValueByType($type, $commissionValue, $grossValue)
    {
        switch ($type) {
            case CommissionTypeConst::PERCENTAGE:
                return $this->percentage($grossValue, $commissionValue);
            case CommissionTypeConst::FIXED_VALUE:
                return $commissionValue;
            default:
                throw new PartnerCommissionException(
                    1400,
                    compact($type)
                );
        }
    }

    /**
     * Calcula porcentagem
     * @param $value
     * @param $percentage
     * @return float|int
     */
    private function percentage($value, $percentage)
    {
        return $value * ($percentage / 100);
    }

    /**
     * @param $request
     * @throws PriceException
     * @throws Exception
     */
    private function validateCalculateAllPricesRequest($request)
    {
        $this->validator->validateCalculatePrice($request);

        $this->waypointsIsValid($waypoints ?? []);
    }
}