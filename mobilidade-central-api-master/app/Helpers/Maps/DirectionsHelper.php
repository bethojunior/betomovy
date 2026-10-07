<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/03/2020
 * Time: 14:33
 */

namespace App\Helpers\Maps;


use App\Contracts\Maps\DirectionsApiContract;
use App\Helpers\Config\ConfigHelper;
use App\Utils\Maps\GoogleMapsApi;
use App\Utils\Maps\HereDirectionsApi;
use App\Utils\Maps\MapBoxDirectionsApi;

class DirectionsHelper
{
    /**
     * @var ConfigHelper
     */
    private $configHelper;

    private $defaultAPI;

    public function __construct(ConfigHelper $configHelper)
    {
        $this->configHelper = $configHelper;

        $this->defaultAPI = $configHelper->get('default_maps_api');
    }

    /**
     * @param $request
     * @return mixed
     * @throws \Exception
     */
    public function getRoute($request)
    {
        $this->requestIsValid($request);

        $origin = explode(',', $request->origin);
        $destination = explode(',', $request->destination);

        if (isset($request->waypoints))
            $waypoints = array_map(function ($waypoint){
                return explode(",", $waypoint);
            }, explode('|', $request->waypoints));

        $defaultApi = $this->choiceDefaultApi();

        return $defaultApi
            ->getDistance(
                $origin[0], $origin[1], $destination[0], $destination[1], $waypoints ?? null);
    }

    /**
     * @param $start_latitude
     * @param $start_longitude
     * @param $end_latitude
     * @param $end_longitude
     * @param array|null $waypoints
     * @return mixed
     * @throws \Exception
     */
    public function getDistance(
        $start_latitude, $start_longitude, $end_latitude, $end_longitude, array $waypoints = null)
    {
        $defaultApi = $this->choiceDefaultApi();

        return $defaultApi
            ->getDistance($start_latitude, $start_longitude, $end_latitude, $end_longitude, $waypoints);
    }

    /**
     * @param $start_latitude
     * @param $start_longitude
     * @param $end_latitude
     * @param $end_longitude
     * @return mixed
     * @throws \Exception
     */
    public function getDistanceWithFullAddress(
        $start_latitude, $start_longitude, $end_latitude, $end_longitude)
    {
        $defaultApi = $this->choiceDefaultApi();

        return $defaultApi
            ->getDistanceWithFullAddress($start_latitude, $start_longitude, $end_latitude, $end_longitude);
    }

    /**
     * @return DirectionsApiContract
     * @throws \Exception
     */
    private function choiceDefaultApi()
    {
        switch ($this->defaultAPI) {
            case 'google':
                return new GoogleMapsApi($this->configHelper->get('google_api_key_backend'));
            case 'here':
                return new HereDirectionsApi($this->configHelper->get('here_api_key'));
            case 'mapbox':
                return new MapBoxDirectionsApi($this->configHelper->get('mapbox_access_token'));
            default:
                throw new \Exception("Erro ao encontrar API Padrão");
        }
    }

    /**
     * @param $request
     * @throws \Exception
     */
    private function requestIsValid($request)
    {
        if (!isset($request->origin))
            throw new \Exception("Origem não enviada");

        if (!isset($request->destination))
            throw new \Exception("Destino não enviado");
    }
}
