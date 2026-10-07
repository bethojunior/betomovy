<?php

namespace app\utils;

use app\constant\MapServiceConst;
use app\contracts\GeocodingInterface;
use app\dao\MapServiceMetaDataDao;
use app\model\Config;
use app\model\Geocoder;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 23/10/2019
 * Time: 10:46
 */
class HereGeocodingApi implements GeocodingInterface
{
    private $app_id;
    private $app_code;
    private $api_key;

    private $BASE_URL_COORDINATE;
    private $BASE_URL_STREET;

    private const TYPE = "here";

    private $keys = [];

    private $cityId;

    public function __construct($cityId = null)
    {
        $this->cityId = $cityId;

        $this->BASE_URL_COORDINATE = "https://revgeocode.search.hereapi.com/v1/revgeocode?";
        $this->BASE_URL_STREET = "https://geocode.search.hereapi.com/v1/geocode?";
    }

    private function loadConfigs()
    {
        if ($this->cityId) {
            $this->keys = $this->getKeyByCity($this->cityId);
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

    /**
     * @param $query
     * @param false $isCoordinate
     * @param bool $retry
     * @return Geocoder
     * @throws Exception
     */
    public function search($query, $isCoordinate = false, bool $retry = false): Geocoder
    {
        if (!$retry) {
            $this->loadConfigs();
        }

        if ($isCoordinate) {
            $query = str_replace(" ", "", $query);
        }

        try {

            $result = $this->request(urlencode($query), $isCoordinate);

            $response = json_decode($result);

            $this->responseIsValid($response);

            $info = $response->items[0];

            $geocoder = new Geocoder;

            $geocoder
                ->setAddress($info->address->label ?? null)
                ->setCity($info->address->city ?? null)
                ->setEstate($info->address->state ?? null)
                ->setNeighborhood($info->address->district ?? null)
                ->setStreet($info->address->street ?? null)
                ->setNumber($info->address->houseNumber ?? null)
                ->setPostalCode($info->address->postalCode ?? null)
                ->setLatitude($info->position->lat)
                ->setLongitude($info->position->lng)
                ->setType(self::TYPE);

            $this->feedAddress($geocoder, $info->address->countryName);

            return $geocoder;
        } catch (Exception $exception) {
            if (is_null($this->getKey()))
                throw $exception;

            return $this->search($query, $isCoordinate, true);
        }
    }

    private function feedAddress(Geocoder &$geocoder, $AdditionalData)
    {
        $geocoder->setCountry($AdditionalData);
    }

    private function request($query, $isCoordinate = false)
    {
        if ($isCoordinate) {
            $url_request = $this->BASE_URL_COORDINATE .
                '?app_id=' . $this->app_id .
                '&apiKey=' . $this->api_key .
                '&app_code=' . $this->app_code .
                '&at=' . $query;
        } else {
            $url_request = $this->BASE_URL_STREET .
                '?app_id=' . $this->app_id .
                '&apiKey=' . $this->api_key .
                '&app_code=' . $this->app_code .
                '&q=' . $query;
        }

        $ch = curl_init($url_request);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        $response = curl_exec($ch);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($curlError) {
            throw new Exception("Erro cURL Here: {$curlError}");
        }

        return $response;
    }

    /**
     * @param $response
     * @throws Exception
     */
    private function responseIsValid($response)
    {
        if (!isset($response->items[0]))
            throw new Exception("Erro here: Não foi possível encontrar o endereço");

        if (!$response->items[0]->address)
            throw new Exception("Erro na comunicação com o here: " . json_encode($response));

        if (empty($response->items[0]->address))
            throw new Exception("Erro here: Não foi possível encontrar o endereço");

    }

    public function getApiKey(): string
    {
        return $this->api_key;
    }
}