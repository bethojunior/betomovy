<?php

namespace app\utils;

use app\constant\MapServiceConst;
use app\contracts\DirectionsApiInterface;
use app\dao\MapServiceMetaDataDao;
use app\model\Config;
use Exception;
use Polyline;
use stdClass;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 07/08/2019
 * Time: 16:39
 */
class HereDistanceApi implements DirectionsApiInterface
{
    private $app_id;
    private $app_code;
    private $api_key;

    private $BASE_URL;
    private const TYPE = "here";

    private $keys = [];

    public function __construct($cityId = null)
    {
        $this->BASE_URL = 'https://router.hereapi.com/v8/routes?';
        
        if ($cityId) {
            $this->keys = $this->getKeyByCity($cityId);
            $this->getKey();
        } else {
            $this->app_id = Config::get('here_app_id', null, true);
            $this->app_code = Config::get('here_code_id', null, true);
            $this->api_key = Config::get('here_api_key', null, true);
        }
    }

    /**
     * @param $cityId
     * @return array
     */
    private function getKeyByCity($cityId)
    {
        $results = (new MapServiceMetaDataDao)->findByMapServiceAndCity(MapServiceConst::HERE, $cityId);

        $keys = [];

        foreach ($results as $item) {
            $keys[$item->groupCode][$item->key] = $item->value;
        }

        return $keys;
    }

    public function isValidKey()
    {
        return ($this->api_key && $this->app_code && $this->app_id);
    }

    private function getIndexRouteOptimizationByConfig($routes)
    {
        $optimization = Config::get('route_optimization_here', null, true);

        $routeIndex = 0;
        $valueAux = null;
        $valueType = $optimization == 'time' ? "duration" : "length";

        foreach ($routes as $index => $route) {
            if (!$valueAux || $valueAux > $route[$valueType]) {
                $valueAux = $route[$valueType];
                $routeIndex = $index;
            }
        }

        return $routeIndex;
    }

    /**
     * @param $start_latitude
     * @param $start_longitude
     * @param $end_latitude
     * @param $end_longitude
     * @param array|null $waypoints
     * @param bool $retry
     * @return object
     * @throws Exception
     */
    public function getDistance(
        $start_latitude, $start_longitude, $end_latitude, $end_longitude, array $waypoints = null, bool $retry = false)
    {
        if (empty($this->api_key)) {
            throw new Exception("HereDistanceApi: API key não configurada");
        }

        try {
            $url = $this
                ->getUrl($start_latitude, $start_longitude, $end_latitude, $end_longitude, $waypoints);

            $result = json_decode($this->request($url));

            $this->responseIsValid($result);

            $routeSummaries = [];
            foreach ($result->routes as $route) {
                $duration = 0;
                $length = 0;
                $routePolyline = [];
                foreach ($route->sections as $section) {
                    $duration += $section->summary->duration;
                    $length += $section->summary->length;

//                    $polyline = FlexiblePolyline::decode($section->polyline);
                    $routePolyline[] = $section->polyline;
                }

                $routeSummaries[] = [
                    'duration' => $duration,
                    'length' => $length,
                    'polyline' => $routePolyline
                ];
            }

            $routeIndex = $this->getIndexRouteOptimizationByConfig($routeSummaries);
            $route = $routeSummaries[$routeIndex];

            $data = array();
            $data['distance'] = $route['length'];
            $data['duration'] = $route['duration'];
            $data['overview_polyline'] = $this->getOverviewPolyLine($route['polyline'] ?? []);
            $data['type'] = self::TYPE;

            return (object)$data;
        } catch (Exception $exception) {
            if (is_null($this->getKey()))
                throw $exception;

            return $this->getDistance($start_latitude, $start_longitude, $end_latitude, $end_longitude, $waypoints, true);
        }
    }

    /**
     * @param $start_latitude
     * @param $start_longitude
     * @param $end_latitude
     * @param $end_longitude
     * @param bool $retry
     * @return stdClass
     * @throws Exception
     */
    public function getDistanceWithFullAddress($start_latitude, $start_longitude, $end_latitude, $end_longitude, bool $retry = false)
    {
        try {

            $url = $this->getUrl($start_latitude, $start_longitude, $end_latitude, $end_longitude);

            $result = json_decode($this->request($url));

            $this->responseIsValid($result);

            $route = $result->routes[0]->sections[0];

            $origin = '';
            foreach ($route->spans as $span) {
                if (!isset($span->names)) {
                    continue;
                }

                $origin = $span->names[0]->value;
                break;
            }

            $destination = end($route->spans);

            $data = new stdClass;
            /* Endereço do destino por extenso */
            $data->destination = $destination->names[0]->value;
            $data->origin = $origin;

            $mapUtils = new MapUtils();

            $data->distance = (object)[
                'text' => $mapUtils->formatDistanceText($route->summary->length),
                'value' => $route->summary->length,
            ];
            $data->duration = (object)[
                'text' => $mapUtils->formatDurationText($route->summary->duration),
                'value' => $route->summary->duration,
            ];

            $data->overview_polyline = $this->getOverviewPolyLine([$route->polyline]);

            return $data;
        } catch (Exception $exception) {
            if (is_null($this->getKey()))
                throw $exception;

            return $this->getDistanceWithFullAddress($start_latitude, $start_longitude, $end_latitude, $end_longitude, true);
        }
    }

    public function request($url)
    {
        $ch = curl_init(str_replace(
            ' ', '', $url));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        $response = curl_exec($ch);
        curl_close($ch);

        return $response;
    }

    /**
     * @param $result
     * @throws Exception
     */
    private function responseIsValid($result)
    {
        if (!isset($result)) {
            throw new Exception("Erro de comunicação com a API: " . json_encode($result));
        }

        if (!isset($result->routes)) {
            throw new Exception("Erro here API " . now());
        }

        if (isset($result->notices) && empty($result->routes)) {
            throw new Exception("Erro here API: " . json_encode($result));
        }
    }

    private function getUrl($start_latitude, $start_longitude, $end_latitude, $end_longitude, array $waypoints = null)
    {
        $url = $this->BASE_URL .
            "transportMode=car" . "&" .
            "origin=" . $start_latitude . "," . $start_longitude . "&" .
            "destination=" . $end_latitude . "," . $end_longitude . "&" .
            "return=polyline,summary" . "&" .
            "spans=names" . "&" .
            "lang=pt-BR" . "&" .
            "apiKey=" . $this->api_key;

        if ($waypoints) {
            foreach ($waypoints as $waypoint) {
                $url .= "&via=" . $waypoint->latitude . "," . $waypoint->longitude;
            }
        }

        return $url;
    }

    private function getKey()
    {
        if (count($this->keys) == 0)
            return null;

        $data = current(array_splice($this->keys, 0, 1));

        $this->app_id = $data['here_app_id'];
        $this->app_code = $data['here_code_id'];
        $this->api_key = $data['here_api_key'];

        return $data;
    }

    private function getOverviewPolyLine(array $flexiblePolyline)
    {
        $points = [];

        foreach ($flexiblePolyline as $polyline) {
            $flexiblePolylineArray = FlexiblePolyline::decode($polyline);

            if (end($flexiblePolyline) != $polyline) {
                array_pop($flexiblePolylineArray['polyline']);
            }

            foreach ($flexiblePolylineArray['polyline'] as $point) {
                $points[] = [$point[0], $point[1]];
            }
        }

        return (object)['points' => Polyline::encode($points)];
    }

    public function getApiKey(): string
    {
        return $this->api_key ?? "";
    }
}