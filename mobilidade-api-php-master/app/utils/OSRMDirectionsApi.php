<?php

namespace app\utils;

use app\contracts\DirectionsApiInterface;
use Exception;
use Polyline;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 01/07/2020
 * Time: 17:17
 */
class OSRMDirectionsApi implements DirectionsApiInterface
{
    private $api_url = "https://routing.openstreetmap.de/routed-car/route/v1/driving/";

    public function getDistance(
        $start_latitude, $start_longitude, $end_latitude, $end_longitude, array $waypoints = null, bool $retry = false)
    {
        $url = $this->getUrl($start_latitude, $start_longitude, $end_latitude, $end_longitude);

        $result = json_decode($this->request($url));

        $this->responseIsValid($result);

        $legs = $result->routes[0]->legs[0];
        $steps = $legs->steps;

        $data = array();
        $data['distance'] = round($legs->distance);
        $data['duration'] = round($legs->duration);
        $data['overview_polyline'] = '';

        $coordinates = [];

        foreach ($steps as $step) {
            $decoded = Polyline::decode($step->geometry);

            for ($i = 0; $i < count($decoded); $i += 2) {
                $coordinates[] = [$decoded[$i], $decoded[$i + 1]];
            }
        }

        $data['overview_polyline'] = (object)['points' => Polyline::encode($coordinates)];

        return (object)$data;
    }

    public function getDistanceWithFullAddress(
        $start_latitude, $start_longitude, $end_latitude, $end_longitude, bool $retry = false)
    {
        // TODO: Implement getDistanceWithFullAddress() method.
    }

    /**
     * @param $result
     * @throws Exception
     */
    private function responseIsValid($result)
    {
        if (!isset($result))
            throw new Exception("Erro de comunicação com a API: " . json_encode($result));

        if (!isset($result->code))
            throw new Exception("Erro OSRM API " . now() . ":" . json_encode($result));

        if ($result->code != "Ok")
            throw new Exception("Erro OSRM API " . now() . ":" . json_encode($result));
    }

    /**
     * @param $url
     * @return bool|string
     */
    private function request($url)
    {
        $ch = curl_init(str_replace(' ', '', $url));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        $response = curl_exec($ch);
        curl_close($ch);

        return $response;
    }

    /**
     * @param $start_latitude
     * @param $start_longitude
     * @param $end_latitude
     * @param $end_longitude
     * @param array|null $waypoints
     * @return string
     */
    private function getUrl(
        $start_latitude, $start_longitude, $end_latitude, $end_longitude, array $waypoints = null)
    {
        $url = $this->api_url .
            "{$start_longitude}, {$start_latitude};{$end_longitude},{$end_latitude}";

        $url .=
            "?overview=false&geometries=polyline&steps=true";

        return $url;
    }


    public function getApiKey(): string
    {
        return "";
    }
}