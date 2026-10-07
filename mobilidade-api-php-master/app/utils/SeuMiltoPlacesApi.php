<?php

namespace app\utils;

use app\constant\SeuMiltoMapsConst;
use app\contracts\PlacesApiInterface;
use app\model\Config;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 28/08/2020
 * Time: 10:47
 */
class SeuMiltoPlacesApi implements PlacesApiInterface
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
    private $base_url;

    private ?int $cityId;

    public function __construct(?int $cityId = null)
    {
        $this->cityId = $cityId;
        $url = env('ENV') === 'production' ?
            SeuMiltoMapsConst::PRODUCTION_DOMAIN_URL :
            SeuMiltoMapsConst::SANDBOX_DOMAIN_URL;
        $this->base_url = $url . 'places?';
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
     * @param null $proximity_string
     * @return array
     * @throws Exception
     */
    public function search($query, $proximity_string = null, bool $retry = false): array
    {
        $this->loadConfigs();

        $result = $this->request($query, $proximity_string);

        $this->resultIsValid($result);

        return $result->response;
    }

    private function request(string $query, $proximity_string = null)
    {
        $url_request = $this->base_url . "q=" . urlencode($query);

        if ($proximity_string) {
            $url_request .= "&latlng=" . str_replace(' ', '', trim($proximity_string));
        }

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

        if ($result->status === false) {
            throw new Exception("Erro seumilto " . now() . ": {$result->message}");
        }

        if (!$result->response) {
            throw new Exception("Erro na comunicação com o seumilto: " . json_encode($result));
        }

        return true;
    }

    public function getApiKey(): string
    {
        return $this->token;
    }
}