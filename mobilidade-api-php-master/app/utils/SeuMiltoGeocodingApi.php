<?php

namespace app\utils;

use app\constant\SeuMiltoMapsConst;
use app\contracts\GeocodingInterface;
use app\model\Config;
use app\model\Geocoder;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 29/08/2020
 * Time: 17:37
 */
class SeuMiltoGeocodingApi implements GeocodingInterface
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
     * @var string $base_url
     */
    private string $base_url;

    /**
     * SeuMiltoGeocodingApi constructor.
     */
    public function __construct()
    {
        $url = env('ENV') === 'production' ?
            SeuMiltoMapsConst::PRODUCTION_DOMAIN_URL :
            SeuMiltoMapsConst::SANDBOX_DOMAIN_URL;
        $this->base_url = $url . 'geocoding?';
    }

    private function loadConfigs(): void
    {
        list('seumilto_token_name' => $token_name, 'seumilto_token' => $token) =
            Config::getMany('seumilto_token_name', 'seumilto_token');

        $this->token_name = $token_name;
        $this->token = $token;
    }

    /**
     * @param $query
     * @param false $isCoordinate
     * @param bool $retry
     * @return Geocoder
     * @throws Exception
     */
    public function search($query, $isCoordinate = false, bool $retry = false): Geocoder
    {
        $this->loadConfigs();

        $result = $this->request($query, $isCoordinate);

        $this->resultIsValid($result);

        $result = $result->response;

        $geocoder = new Geocoder;
        return $geocoder
            ->setLatitude($result->latitude)
            ->setLongitude($result->longitude)
            ->setAddress($result->address)
            ->setNeighborhood($result->neighborhood ?? null)
            ->setPostalCode($result->postal_code ?? null)
            ->setCity($result->city ?? null)
            ->setEstate($result->estate ?? null)
            ->setCountry($result->country ?? null);
    }

    /**
     * @param string $query
     * @param bool|null $isCoordinate
     * @return mixed
     */
    private function request(string $query, bool $isCoordinate = false)
    {
        $url_request = $this->base_url .
            ($isCoordinate ?
                'latlng=' . str_replace(' ', '', trim($query)) :
                'address=' . urlencode($query));

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