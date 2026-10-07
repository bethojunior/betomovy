<?php

namespace App\Utils;

use App\Helpers\Config\ConfigHelper;
use App\Models\Config\Address;
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

    public function __construct(ConfigHelper $configHelper)
    {

        list(
            'url_address_cache_fb704'          => $base_url,
            'keysearch_address_cache_fb704'    => $token,
            'keyreadwrite_address_cache_fb704' => $writeToken
        ) = $configHelper->get(
            'url_address_cache_fb704',
            'keysearch_address_cache_fb704',
            'keyreadwrite_address_cache_fb704'
        );

        $this->token            = $token;
        $this->writeToken       = $writeToken;
        $this->base_url         = $base_url;
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
        string $query,
        string $proximity_string,
        string $fb_customer_name,
        ?string $distance = null
    ): array
    {
        $this->query            = $query;
        $this->proximity_string = $proximity_string;
        $this->distance         = $distance;

        $result = $this->getRequest($fb_customer_name);

        $this->resultIsValid($result);

        return $result->results;
    }

    public function insert(Address $address, string $fb_customer_name): array
    {
        $data = [
            'client'    => $fb_customer_name,
            'address'   => $address->address,
            'latitude'  => $address->latitude,
            'longitude' => $address->longitude,
            'manual'    => $address->manual,
            'blocked'   => $address->blocked,
            'type'      => $address->type,
            'id'        => $address->id
        ];

        $result = $this->postRequest($data);

        if (!$result->result) {
            throw new Exception("Erro na comunicação com o seumilto v2: " . json_encode($result));
        }

        if (!in_array($result->code, [200, 201])) {
            throw new Exception("Erro ao inserir no seumilto v2: " . json_encode($result));
        }

        return (array) $result->result;
    }

    public function delete(string $id): array
    {
        $result = $this->deleteRequest($id);

        if ($result->code !== 200) {
            throw new Exception("Erro ao inserir no seumilto v2: " . json_encode($result));
        }

        return (array) $result->result;
    }

    public function deleteByAddress(string $address, string $customer): array
    {
        $data = compact('address', 'customer');

        $result = $this->deleteByAddressRequest($data);

        if ($result->code !== 200) {
            throw new Exception("Erro ao inserir no seumilto v2: " . json_encode($result));
        }

        return (array) $result->result;
    }

    public function searchByCustomer(
        string $query,
        string $fb_customer_name
    ): array
    {
        $this->query = $query;

        $result = $this->getRequestByCustomer($fb_customer_name);

        $this->resultIsValid($result);

        return array_map(function ($item) {
            $coordinates = explode(',', $item->location->raw);

            return [
                'address' => $item->address->raw,
                'id'      => $item->id->raw,
                'latitude'  => $coordinates[0] ?? '',
                'longitude' => $coordinates[1] ?? '',
            ];
        }, $result->results);
    }
    private function getRequestByCustomer(string $fb_customer_name): ?stdClass
    {
        $url_request = $this->base_url . "manual_places/by_customer/$fb_customer_name?q=" . urlencode($this->query);

        $ch = curl_init($url_request);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['auth_token: ' . $this->token]);
        $response = curl_exec($ch);
        curl_close($ch);

        return json_decode($response);
    }


    private function deleteRequest(string $id): ?stdClass
    {
        $url_request = $this->base_url . "places/{$id}";

        $ch = curl_init($url_request);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Content-Type: application/json",
            "Accept: application/json",
            "auth_token: " . $this->writeToken
        ]);
        $response = curl_exec($ch);
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return (object) [
            'result' => json_decode($response),
            'code'   => $http_code
        ];
    }

    private function deleteByAddressRequest($data): ?stdClass
    {
        $url_request = $this->base_url . "documents/by_address";

        $ch = curl_init($url_request);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Content-Type: application/json",
            "Accept: application/json",
            "auth_token: " . $this->writeToken
        ]);
        $response = curl_exec($ch);
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return (object) [
            'result' => json_decode($response),
            'code'   => $http_code
        ];
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

        return (object) [
            'result' => json_decode($response),
            'code'   => $http_code
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
