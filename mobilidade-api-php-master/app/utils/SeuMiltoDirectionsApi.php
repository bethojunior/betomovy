<?php

namespace app\utils;

use app\constant\SeuMiltoMapsConst;
use app\contracts\DirectionsApiInterface;
use app\model\Config;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 29/08/2020
 * Time: 18:54
 */
class SeuMiltoDirectionsApi implements DirectionsApiInterface
{
    /**
     * @var mixed
     */
    private $token_name;

    /**
     * @var mixed
     */
    private $token;

    /**
     * @var string $api_url_directions
     */
    private string $api_url_directions;

    public function __construct()
    {
        $url = env('ENV') === 'production' ?
            SeuMiltoMapsConst::PRODUCTION_DOMAIN_URL :
            SeuMiltoMapsConst::SANDBOX_DOMAIN_URL;

        $this->api_url_directions = $url . "directions";
    }

    private function loadConfigs(): void
    {
        list('seumilto_token_name' => $token_name, 'seumilto_token' => $token) =
            Config::getMany('seumilto_token_name', 'seumilto_token');

        $this->token_name = $token_name;
        $this->token = $token;
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
        $this->loadConfigs();

        $url = $this->getUrl($start_latitude, $start_longitude, $end_latitude, $end_longitude, $waypoints);

        $result = $this->request($url);

        $this->resultIsValid($result);

        $response = $result->response;

        $data = [];
        // Distancia em metros
        $data['distance'] = $response->distance;
        // Tempo em segundos
        $data['duration'] = $response->duration;
        $data['overview_polyline'] = (object)['points' => $response->overview_polyline];

        return (object)$data;
    }

    public function getDistanceWithFullAddress($start_latitude, $start_longitude, $end_latitude, $end_longitude, bool $retry = false)
    {
        $this->loadConfigs();

        $url = $this->getUrlForFullAddress($start_latitude, $start_longitude, $end_latitude, $end_longitude);

        $result = $this->request($url);

        $this->resultIsValid($result);

        return $result->response;
    }

    /**
     * @param string $url_request
     * @return mixed
     */
    private function request(string $url_request)
    {
        $ch = curl_init($url_request);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Accept: application/json',
            'token: ' . $this->token,
            'tokenname: ' . $this->token_name
        ));
        $response = curl_exec($ch);
        curl_close($ch);

        return json_decode($response);
    }

    /**
     * @param $start_latitude
     * @param $start_longitude
     * @param $end_latitude
     * @param $end_longitude
     * @param array|null $wayPoints
     * @return string
     */
    private function getUrl(
        $start_latitude, $start_longitude, $end_latitude, $end_longitude, array $wayPoints = null): string
    {
        $origin = $start_latitude . ',' . $start_longitude;
        $destination = $end_latitude . ',' . $end_longitude;

        $url = $this->api_url_directions .
            "?origin={$origin}&destination={$destination}";

        if (!empty($wayPoints)) {
            $wayPoints = implode('|', array_map(function ($destination) {
                return implode(',', (array)$destination);
            }, $wayPoints));

            $url .= "&waypoints={$wayPoints}";
        }

        return $url;
    }

    /**
     * @param $start_latitude
     * @param $start_longitude
     * @param $end_latitude
     * @param $end_longitude
     * @return string
     */
    private function getUrlForFullAddress($start_latitude, $start_longitude, $end_latitude, $end_longitude): string
    {
        return $this->api_url_directions .
            "/full-address?origin={$start_latitude},{$start_longitude}&destination={$end_latitude},{$end_longitude}";
    }

    /**
     * @param $result
     * @return bool
     * @throws Exception
     */
    private function resultIsValid($result)
    {
        if (!$result) {
            throw new Exception("Erro na comunicação com o seumilto: " . json_encode($result));
        }

        if (!$result->status) {
            throw new Exception("Erro seumilto " . now() . ": {$result->message}");
        }

        return true;
    }

    public function getApiKey(): string
    {
        return $this->token;
    }
}