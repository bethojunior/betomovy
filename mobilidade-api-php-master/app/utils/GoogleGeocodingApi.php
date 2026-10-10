<?php

namespace app\utils;

use app\contracts\GeocodingInterface;
use app\dao\MapServiceMetaDataDao;
use app\model\Config;
use app\model\Geocoder;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 23/10/2019
 * Time: 09:19
 */
class GoogleGeocodingApi implements GeocodingInterface
{
    private $apiKey;

    private const API_URL = "https://maps.googleapis.com/maps/api/geocode/json?";
    private const TYPE = "google";

    private $keys = [];
    private $cityId;


    public function __construct($cityId = null)
    {
        $this->cityId = $cityId;
    }

    private function loadConfigs()
    {
        $keys = [];
        if ($this->cityId) {
            $cityKeysBackend = $this->getKeyByCity('google_api_key_backend', $this->cityId);
            $cityKeys = $this->getKeyByCity('google_api_key', $this->cityId);
            $keys = array_merge($keys, is_array($cityKeysBackend) ? $cityKeysBackend : [], is_array($cityKeys) ? $cityKeys : []);
        }

        $globalCandidates = [
            Config::get('google_api_key_backend', null, true),
            Config::get('google_api_key', null, true),
            Config::get('key_google_maps', null, true),
            Config::get('key_google', null, true),
            Config::get('google_api_key_web', null, true),
            env('GOOGLE_API_KEY_API'),
            env('GOOGLE_API_KEY'),
        ];

        foreach ($globalCandidates as $cand) {
            if (!empty($cand) && is_string($cand) && trim($cand) !== '') {
                $cand = trim($cand);
                if (!in_array($cand, $keys)) {
                    $keys[] = $cand;
                }
            }
        }

        $this->keys = $keys;
        $this->apiKey = $this->getKey();
    }
    /**
     * @param $key
     * @param $cityId
     * @return array
     */
    private function getKeyByCity($key, $cityId)
    {
        $results = (new MapServiceMetaDataDao)->findByCity($key, $cityId);

        return array_map(function ($item) {
            return $item->value;
        }, $results);
    }

    public function isValidKey()
    {
        return $this->apiKey;
    }

    private function getKey()
    {
        if (count($this->keys) > 0)
            return array_splice($this->keys, 0, 1)[0];

        return null;
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

        try {
            $result = $this->request(urlencode($query), $isCoordinate);

            $result = json_decode($result);

            $this->resultIsValid($result);

            $address = $result->results[0];

            $geocoder = new Geocoder;

            $this->feedAddress($geocoder, $address->address_components);

            $geocoder
                ->setAddress($address->formatted_address)
                ->setLatitude($address->geometry->location->lat)
                ->setLongitude($address->geometry->location->lng)
                ->setType(self::TYPE);

            return $geocoder;
        } catch (Exception $exception) {
            $this->apiKey = $this->getKey();

            if (is_null($this->apiKey))
                throw $exception;

            return $this->search($query, $isCoordinate, true);
        }
    }

    private function feedAddress(Geocoder &$geocoder, $address_components)
    {
        foreach ($address_components as $component) {
            if (in_array('street_number', $component->types)) {
                $geocoder->setNumber($component->long_name);
                continue;
            }

            if (in_array('route', $component->types)) {
                $geocoder->setStreet($component->long_name);
                continue;
            }

            if (in_array('sublocality_level_1', $component->types)) {
                $geocoder->setNeighborhood($component->long_name);
                continue;
            }

            if (in_array('administrative_area_level_2', $component->types)) {
                $geocoder->setCity($component->long_name);
                continue;
            }

            if (in_array('administrative_area_level_1', $component->types)) {
                $geocoder->setEstate($component->short_name);
                continue;
            }

            if (in_array('country', $component->types)) {
                $geocoder->setCountry($component->long_name);
                continue;
            }

            if (in_array('postal_code', $component->types)) {
                $geocoder->setPostalCode($component->long_name);
                continue;
            }
        }
    }

    private function request($query, $isCoordinate = false)
    {
        $url_request =
            self::API_URL . 'key=' .
            $this->apiKey;

        $url_request .= $isCoordinate ? '&latlng=' . $query : '&address=' . $query;

        $url_request .= '&language=pt-BR';

        $ch = curl_init(str_replace(
            ' ', '', $url_request));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        $response = curl_exec($ch);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($curlError) {
            throw new Exception("Erro cURL Google: {$curlError}");
        }

        return $response;
    }

    /**
     * @param $result
     * @return bool
     * @throws Exception
     */
    private function resultIsValid($result)
    {
        if (!$result)
            throw new Exception("Erro na comunicação com o google: " . json_encode($result));

        if (isset($result->error_message))
            throw new Exception("Erro google " . now() . ": {$result->error_message}");

        if ($result->status != "OK")
            throw new Exception("Erro google " . now() . ": {$result->status}");

        return true;
    }

    public function getApiKey(): string
    {
        return $this->apiKey ?? "";
    }
}