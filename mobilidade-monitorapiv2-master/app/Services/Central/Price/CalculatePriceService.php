<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/06/2019
 * Time: 09:13
 */

namespace App\Services\Central\Price;


use App\Exceptions\Price\PriceException;
use App\Models\Central\Price;
use App\Repositories\Central\PriceRepository;
use App\Utils\GoogleMapsApi;

class CalculatePriceService
{
    /**
     * @var PriceRepository
     */
    private $repository;
    /**
     * @var GoogleMapsApi
     */
    private $maps_api;

    public function __construct(PriceRepository $repository, GoogleMapsApi $maps_api)
    {
        $this->repository = $repository;
        $this->maps_api = $maps_api;
    }

    /**
     * @param $central_id
     * @param array $request_query
     * @return array
     * @throws PriceException
     * @throws \Exception
     */
    public function getPrices($central_id, array $request_query)
    {
        $origin_coordinate = explode(',', $request_query['origin']);
        $destination_coordinate = explode(',', $request_query['destination']);
        $waypoints = $this->getWayPoints($request_query['waypoints'] ?? null);

        $prices = $this->getCentralPrices($central_id);

        $estimative = $this->getEstimative($origin_coordinate, $destination_coordinate, $waypoints);

        $prices = $prices->map(function(Price $price) use ($estimative){

            $calculated_price = $this->calculatePrice(
                $estimative, $price);

            return [
                'idPrice' => $price->id,
                'price' => $calculated_price,
                'tripTypeId' => $price->tripTypeId,
                'priceName' => $price->tripType->type,
                'typeDrivers' => $price->tripType->driversType,
                'tag' => $price->tag,
                'color' => $price->color,
            ];
        });

        return [
            'prices' => $prices,
            'distance' => $this->getFormattedDistance($estimative->distance),
            'duration' => $this->getFormattedTime($estimative->duration),
        ];
    }

    /**
     * @param $estimative
     * @param Price $price
     * @return \stdClass
     */
    private function calculatePrice($estimative, Price $price)
    {
        $base_price = $price->base_price;
        $km_price = $this->getFormattedDistance($estimative->distance) * $price->km_price;
        $minute_price = $this->getFormattedTime($estimative->duration) * $price->minute_price;

        $calculated_price =
            $base_price +
            $km_price +
            $minute_price +
            $price->tax_price +
            $price->another_fee;

        $calculated_price = $calculated_price < $price->min_price ?
            $price->min_price :
            $calculated_price;

        return round($calculated_price, 2);
    }

    /**
     * @param $central_id
     * @return \Illuminate\Database\Eloquent\Collection|\Illuminate\Support\Collection
     * @throws PriceException
     */
    private function getCentralPrices($central_id)
    {
        $prices = $this->repository
            ->findByCentral($central_id);

        if (!$prices)
            throw new PriceException("Não existe preços cadastrados para essa central");

        return $prices;
    }

    /**
     * @param array $origin
     * @param array $destination
     * @param array|null $waypoints
     * @return \stdClass
     * @throws \Exception
     */
    private function getEstimative(array $origin, array $destination, ?array $waypoints = null)
    {
        $estimative = $this->maps_api
            ->getDistance($origin[0], $origin[1], $destination[0], $destination[1], $waypoints);

        return $estimative;
    }

    /**
     * Retorna a distancia em km
     * @param $distanceInMeters
     * @return float|int
     */
    protected function getFormattedDistance($distanceInMeters)
    {
        return round($distanceInMeters / 1000, 2);
    }

    /**
     * Retorna o tempo em minutos
     * @param $distanceInSeconds
     * @return float|int
     */
    protected function getFormattedTime($distanceInSeconds)
    {
        return round($distanceInSeconds / 60, 2);
    }

    /**
     * @param $waypoints
     * @return array|null
     */
    private function getWayPoints($waypoints)
    {
        if (!$waypoints)
            return null;

        $points = explode('|', $waypoints);
        $waypoints_coords = [];

        foreach ($points as $point) {
            $waypoints_coords[] = explode(',', $point);
        }

        return $waypoints_coords;
    }
}
