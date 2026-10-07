<?php

namespace app\utils;

use app\constant\MapServiceConst;
use app\contracts\PlacesApiInterface;
use app\dao\MapServiceMetaDataDao;
use app\model\Config;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 31/07/2019
 * Time: 14:13
 */
class HerePlacesApi implements PlacesApiInterface
{
    private $app_id;
    private $app_code;
    private $api_key;

    private $BASE_URL;
    private const TYPE = "here";

    private $keys = [];
    private $cityId;

    /**
     * HerePlacesApi constructor.
     * @param int|null $cityId
     * @throws Exception
     */
    public function __construct(int $cityId = null)
    {
        $this->cityId   = $cityId;
        $this->BASE_URL = 'https://autosuggest.search.hereapi.com/v1/autosuggest?';
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

    public function search($query, $proximity_string = null, bool $retry = false): array
    {
        if (!$retry) {
            $this->loadConfigs();
        }

        try {
            $result = $this->request(urlencode($query), $proximity_string);

            $response = json_decode($result);

            if (!isset($response->items)) {
                throw new Exception("Não foi possível encontrar endereços");
            }

            $predictions = array_map(function ($prediction) {
                $address = str_replace(['<b>', "</b>"], '',
                    ($prediction->highlightedVicinity ?? $prediction->vicinity ?? $prediction->title)
                );

                $address = str_replace(["<br/>"], ' ', $address);

                if ($prediction->title) {
                    $address = $prediction->title . ', ' . $address;
                }

                return (object)[
                    'address' => $address,
                    'latitude' => $prediction->position->lat ?? null,
                    'longitude' => $prediction->position->lng ?? null,
                    'neighborhood' => $prediction->address->district ?? null,
                    'city' => $prediction->address->city ?? null,
                    'state' => $prediction->address->stateCode ?? $prediction->address->state ?? null,
                    'type' => self::TYPE
                ];
            }, $response->items);

            return $predictions;
        } catch (Exception $exception) {
            if (is_null($this->getKey()))
                throw $exception;

            return $this->search($query, $proximity_string, true);
        }
    }

    private function request($query, $proximity_string = null)
    {

        $url_request =
            $this->BASE_URL .
            'apiKey=' . $this->api_key .
            '&app_id=' . $this->app_id .
            '&app_code=' . $this->app_code .
            '&at=' . $proximity_string .
            '&lang=pt-BR' .
            '&q=' . $query;

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

    public function getApiKey(): string
    {
        return $this->api_key;
    }
}