<?php

namespace app\utils;
use app\model\Address;
use app\model\Config;
use Exception;
use stdClass;

class SeuMiltoPlacesV2
{
    /**
     * @var mixed
     */
    private $token;

    /**
     * @var mixed
     */
    private $writeToken;

    /**
     * @var string $base_url
     */
    private $base_url;

    /**
     * @var string $query
     */
    private $query;

    /**
     * @var string $proximity_string
     */
    private $proximity_string;

    /**
     * @var null|integer $distance
     */
    private $distance;

    public function __construct()
    {
        list(
            'url_address_cache_fb704' => $base_url,
            'keysearch_address_cache_fb704' => $token,
            'keyreadwrite_address_cache_fb704' => $writeToken
            ) = Config::getMany(
            'url_address_cache_fb704',
            'keysearch_address_cache_fb704',
            'keyreadwrite_address_cache_fb704'
        );

        $this->token = $token;
        $this->writeToken = $writeToken;
        $this->base_url = $base_url;
    }

    /**
     * Buscar os endereços no cache do cliente
     * - $fb_customer_name: project_name que está cadastrado no admin
     *
     * @param string $query
     * @param string $proximity_string
     * @param string $fb_customer_name
     * @param string|null $distance
     * @return array
     * @throws Exception
     */
    public function search(
        string  $query,
        string  $proximity_string,
        string  $fb_customer_name,
        ?string $distance = null
    ): array
    {
        $this->query = $query;
        $this->proximity_string = $proximity_string;
        $this->distance = $distance;

        $result = $this->getRequest($fb_customer_name);

        $this->resultIsValid($result);

        return $result->results;
    }

    public function insert(Address $address, string $fb_customer_name): array
    {
        $data = [
            'client' => $fb_customer_name,
            'address' => $address->getAddress(),
            'latitude' => $address->getLatitude(),
            'longitude' => $address->getLongitude(),
            'type' => $address->getType(),
            'created_at' => $address->getCreatedAt(),
            'id' => $address->getIdAddress()
        ];

        $result = $this->postRequest($data);

        if (!$result->result) {
            throw new Exception("Erro na comunicação com o seumilto v2: " . json_encode($result));
        }

        if (!in_array($result->code, [200, 201])) {
            throw new Exception("Erro ao inserir no seumilto v2: " . json_encode($result));
        }

        return (array)$result->result;
    }

    private function postRequest($data): ?stdClass
    {
        $url_request = $this->base_url . "places";

        $ch = curl_init($url_request);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Content-Type: application/json",
            "Accept: application/json",
            "auth_token: " . $this->writeToken
        ]);
        $response = curl_exec($ch);
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return (object)[
            'result' => json_decode($response),
            'code' => $http_code
        ];
    }

    /**
     * @param string $fb_customer_name
     * @return stdClass|null
     */
    private function getRequest(string $fb_customer_name): ?stdClass
    {
        $url_request = $this->base_url . "places?q=" . urlencode($this->query);
        $url_request .= "&proximity=" . str_replace(' ', '', trim($this->proximity_string));
        $url_request .= "&client=" . $fb_customer_name;

        if ($this->distance !== null) {
            $url_request .= "&distance=" . $this->distance;
        }

        $ch = curl_init($url_request);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['auth_token: ' . $this->token]);
        $response = curl_exec($ch);
        curl_close($ch);

        return json_decode($response);
    }

    /**
     * @param $result
     * @return bool
     * @throws Exception
     */
    private function resultIsValid($result): bool
    {
        if (!$result) {
            throw new Exception("Erro na comunicação com o seumilto v2: " . json_encode($result));
        }

        if (!isset($result->results)) {
            throw new Exception("Erro na comunicação com o seumilto v2: " . json_encode($result));
        }

        return true;
    }
}
