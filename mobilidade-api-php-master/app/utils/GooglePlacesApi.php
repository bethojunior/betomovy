<?php

namespace app\utils;

use app\contracts\PlacesApiInterface;
use app\dao\LogDao;
use app\dao\MapServiceMetaDataDao;
use app\model\Config;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 10/07/2019
 * Time: 14:03
 */
class GooglePlacesApi implements PlacesApiInterface
{
    private $apiKey;

    private $keys = [];

    private const API_URL = "https://maps.googleapis.com/maps/api/place/autocomplete/json?";

    private const TYPE = "google";

    private $cityId;

    public function __construct($cityId = null)
    {
        $this->cityId = $cityId;
    }

    private function loadConfigs()
    {
        if ($this->cityId) {
            $this->keys = $this->getKeyByCity('google_api_key_backend', $this->cityId);
        } else {
            $this->keys[] = Config::get('google_api_key_backend', null, true);
        }

        $this->apiKey = $this->getKey();
    }

    /**
     * @param $key
     * @param $cityId
     * @return false
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

    /**
     * @param $query
     * @param null $proximity_string
     * @return array
     * @throws Exception
     */
    public function search($query, $proximity_string = null, bool $retry = false): array
    {
        if (!$retry) {
            $this->loadConfigs();
        }

        try {
            $result = $this->request(urlencode($query), $proximity_string);

            $result = json_decode($result);

            $this->resultIsValid($result);

            $predictions = array_map(function ($prediction) {
                $location = $this->parseCityState($prediction->terms ?? []);

                return (object)[
                    'address' => $prediction->description,
                    'latitude' => null,
                    'longitude' => null,
                    'neighborhood' => null,
                    'city' => $location['city'],
                    'state' => $location['state'],
                    'type' => self::TYPE
                ];
            }, $result->predictions);

            return $predictions;
        } catch (Exception $exception) {
            $this->apiKey = $this->getKey();

            if (is_null($this->apiKey))
                throw $exception;

            return $this->search($query, $proximity_string, true);
        }
    }

    /**
     * Google Autocomplete não retorna endereço estruturado (só a Place Details API tem
     * isso, com chamada extra por place_id). O array "terms" vem atomizado por segmento
     * (ex: [..., "Centro", "Bebedouro", "SP", "Brasil"]) e no padrão observado sempre
     * termina em país, estado, cidade — nessa ordem, contado do fim. É heurística baseada
     * na formatação observada, não um contrato garantido pela Google.
     */
    private function parseCityState(array $terms): array
    {
        $count = count($terms);

        if ($count < 3)
            return ['city' => null, 'state' => null];

        return [
            'city' => $terms[$count - 3]->value ?? null,
            'state' => $terms[$count - 2]->value ?? null
        ];
    }

    private function getKey()
    {
        if (count($this->keys) > 0)
            return array_splice($this->keys, 0, 1)[0];

        return null;
    }

    private function request($query, $proximity_string = null)
    {
        $url_request =
            self::API_URL . 'key=' .
            $this->apiKey . '&input=' .
            $query . '&language=pt-BR&radius=10000';
//            $query.'&language=pt-BR&strictbounds&radius=5000&components=country:br';

        if ($proximity_string)
            $url_request .= "&location=" . str_replace(' ', '', trim($proximity_string));

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
        if (!$result) {
            throw new Exception("Erro na comunicação com o google: " . json_encode($result));
        }

        if (isset($result->error_message)) {
            throw new Exception("Erro google " . now() . ": {$result->error_message}");
        }

        if ($result->status != "OK") {
            throw new Exception("Erro google " . now() . ": {$result->status}");
        }

        return true;
    }

    public function getApiKey(): string
    {
        return $this->apiKey ?? "";
    }
}