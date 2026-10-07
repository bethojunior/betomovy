<?php

namespace App\Utils\Admin704Apps;
use App\Http\Responses\ApiResponse;

class Admin704Apps
{
    private $api_url;
    private $secret;
    private $id;

    public function __construct()
    {
        $this->api_url = env('ADMIN704APPS_API_URL');
        $this->secret = env('ADMIN704APPS_API_SECRET');
        $this->id = env('ADMIN704APPS_API_ID');
    }

    public function loginCustomer()
    {
        $url = '/customer/login/' . env('APP_NAME');
        return $this->makeRequestApi($url, 'POST');
    }

    /**
     * List all countries
     *
     * @throws \Exception
     * @return mixed
     */
    public function getCountries($query = null)
    {
        $url = "/countries";

        $params = [];

        if ($query) {
            $params['q'] = $query;
        }

        if (count($params)) {
            $url .= '?' . http_build_query($params);
        }

        return $this->makeRequestApi($url, 'GET');
    }

    /**
     * Get country by id
     *
     * @throws \Exception
     * @return mixed
     */
    public function getCountryById(int $id)
    {
        $url = "/countries/".$id;

        return $this->makeRequestApi($url, 'GET');
    }

    /**
     * Create country
     *
     * @throws \Exception
     * @return mixed
     */
    public function createCountry(array $data)
    {
        $url = "/countries";

        return $this->makeRequestApi($url, 'POST', $data);
    }

    /**
     * Update country
     *
     * @throws \Exception
     * @return mixed
     */
    public function updateCountry(int $id, array $data)
    {
        $url = "/countries/".$id;

        return $this->makeRequestApi($url, 'PUT', $data);
    }

    /**
     * Delete country
     *
     * @throws \Exception
     * @return mixed
     */
    public function deleteCountry(int $id)
    {
        $url = "/countries/".$id;

        return $this->makeRequestApi($url, 'DELETE');
    }

    /**
     * List all estates
     *
     * @throws \Exception
     * @return mixed
     */
    public function getEstates($query = null)
    {
        $url = "/estates";

        $params = [];

        if ($query) {
            $params['q'] = $query;
        }

        if (count($params)) {
            $url .= '?' . http_build_query($params);
        }

        return $this->makeRequestApi($url, 'GET');
    }

    /**
     * Get estate by id
     *
     * @throws \Exception
     * @return mixed
     */
    public function getEstateById(int $id)
    {
        $url = "/estates/".$id;

        return $this->makeRequestApi($url, 'GET');
    }

    /**
     * Create estate
     *
     * @throws \Exception
     * @return mixed
     */
    public function createEstate(array $data)
    {
        $data['name'] = $data['nome'];
        $data['country_id'] = $data['countryId'];

        unset($data['nome']);
        unset($data['countryId']);

        $url = "/estates";

        return $this->makeRequestApi($url, 'POST', $data);
    }

    /**
     * Update estate
     *
     * @throws \Exception
     * @return mixed
     */
    public function updateEstate(int $id, array $data)
    {
        $url = "/estates/".$id;

        return $this->makeRequestApi($url, 'PUT', $data);
    }

    /**
     * Delete estate
     *
     * @throws \Exception
     * @return mixed
     */
    public function deleteEstate(int $id)
    {
        $url = "/estates/".$id;

        return $this->makeRequestApi($url, 'DELETE');
    }

    /**
     * List all states by country id
     *
     * @throws \Exception
     * @return mixed
     */
    public function getEstatesByCountryId(int $countryId)
    {
        $url = "/estates/country/".$countryId;

        return $this->makeRequestApi($url, 'GET');
    }

    /**
     * List all cities
     *
     * @throws \Exception
     * @return mixed
     */
    public function getCities($query = null, $estateId = null)
    {
        $url = "/cities";

        $params = [];

        if ($query) {
            $params['q'] = $query;
        }

        if ($estateId) {
            $params['estateId'] = $estateId;
        }

        if (count($params)) {
            $url .= '?' . http_build_query($params);
        }

        return $this->makeRequestApi($url, 'GET');
    }

    /**
     * Get city by id
     *
     * @throws \Exception
     * @return mixed
     */
    public function getCityById(int $id)
    {
        $url = "/cities/".$id;

        return $this->makeRequestApi($url, 'GET');
    }

    /**
     * Create city
     *
     * @throws \Exception
     * @return mixed
     */
    public function createCityName(array $data)
    {
        $data['name'] = $data['nome'];
        $data['estate_id'] = $data['estado'];
        $data['short_name'] = $data['nome'];

        unset($data['nome']);
        unset($data['estado']);

        $url = "/cities";

        if (isset($data['polygon'])) {
            return $this->makeRequestInsertCityAreaApi($url, 'POST', $data);
        } else {
            return $this->makeRequestApi($url, 'POST', $data);
        }
    }

    /**
     * @throws \Exception
     */
    public function updateCityArea(int $id, array $data)
    {
        $url = "/cities/".$id;

        if (isset($data['polygon'])) {
            return $this->makeRequestInsertCityAreaApi($url, 'PUT', $data);
        } else {
            return $this->makeRequestApi($url, 'PUT', $data);
        }
    }

    public function deleteCityName(int $id)
    {
        $url = "/cities/".$id;

        return $this->makeRequestApi($url, 'DELETE');
    }

    /**
     * Get app types
     *
     * @throws \Exception
     * @return mixed
     */
    public function getAppTypes()
    {
        $url = "/appVersion/external/app/types";

        return $this->makeRequestApi($url, 'GET');
    }

       /**
     * Get app types
     *
     * @throws \Exception
     * @return mixed
     */
    public function getVersionById($id)
    {
        $url = "/appVersion/versions/".$id;

        return $this->makeRequestApi($url, 'GET');
    }   

    /**
     * Make request to API
     *
     * @throws \Exception
     * @return mixed
     */
    private function makeRequestApi($url, $method, $data = [])
    {
        $headers = [
            'Accept: application/json',
            'secret: ' . $this->secret,
            'id: ' . $this->id
        ];

        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_URL => $this->api_url . $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_POSTFIELDS => $data,
            CURLOPT_HTTPHEADER => $headers,
        ]);

        $response = curl_exec($curl);   

        if ($response === false) {
            $error = curl_error($curl);
            curl_close($curl);
            throw new \Exception("cURL Error: $error");
        }

        curl_close($curl);

        $result = json_decode($response);

        if (!$result->status) {
            return ApiResponse::error(
                $result->response,
                'Error',
                400,
                false
            );
        }

        return $result->response ?? true;
    }

    /**
     * Make request to API
     *
     * Payloads de polígono podem passar de vários MB, então o corpo é enviado
     * comprimido com gzip quando ultrapassa o limite configurado. O admin
     * descomprime via middleware ao receber `Content-Encoding: gzip`.
     *
     * @throws \Exception
     * @return mixed
     */
    private function makeRequestInsertCityAreaApi($url, $method, $data = [])
    {
        $payload = json_encode($data);

        if ($payload === false) {
            throw new \Exception('Falha ao serializar payload para Admin704Apps: ' . json_last_error_msg());
        }

        $headers = [
            'Accept: application/json',
            'Content-Type: application/json',
            'secret: ' . $this->secret,
            'id: ' . $this->id
        ];

        $originalSize = strlen($payload);
        $compressed = $this->compressPayload($payload);

        if (!is_null($compressed)) {
            $payload = $compressed;
            $headers[] = 'Content-Encoding: gzip';
            $headers[] = 'X-Content-Encoding: gzip';
        }

        $headers[] = 'Content-Length: ' . strlen($payload);
        // Evita o handshake `Expect: 100-continue` que o cURL adiciona em corpos grandes.
        $headers[] = 'Expect:';

        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_URL => $this->api_url . $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_HTTPHEADER => $headers,
        ]);

        $response = curl_exec($curl);
        
        if ($response === false) {
            $error = curl_error($curl);
            curl_close($curl);
            throw new \Exception("cURL Error: $error");
        }

        $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        curl_close($curl);

        if ($httpCode === 413) {
            throw new \Exception(sprintf(
                'Admin704Apps recusou o corpo da requisição por tamanho [HTTP 413]: %s enviados (%s originais).',
                $this->formatBytes(strlen($payload)),
                $this->formatBytes($originalSize)
            ));
        }

        $result = json_decode($response);

        if (!$result->status) {
            throw new \Exception($result->message ?? $result);
        }

        return $result->response ?? true;
    }

    /**
     * Comprime o corpo quando vale a pena, ou retorna null para enviar sem compressão.
     */
    private function compressPayload(string $payload): ?string
    {
        if (!function_exists('gzencode')) {
            return null;
        }

        if (!filter_var(env('ADMIN704APPS_API_GZIP', true), FILTER_VALIDATE_BOOLEAN)) {
            return null;
        }

        $minBytes = (int) env('ADMIN704APPS_API_GZIP_MIN_BYTES', 65536);

        if (strlen($payload) < $minBytes) {
            return null;
        }

        $compressed = gzencode($payload, 6);

        if ($compressed === false || strlen($compressed) >= strlen($payload)) {
            return null;
        }

        return $compressed;
    }

    private function formatBytes(int $bytes): string
    {
        if ($bytes >= 1048576) {
            return round($bytes / 1048576, 2) . 'MB';
        }

        return round($bytes / 1024, 2) . 'KB';
    }

    public function getInformationsConfigGeneralByKey($key)
    {
        $apiUrl = '/configs_general_admin/' . $key;
        return $this->makeRequestApi($apiUrl, 'GET');
    }

    public function getBillsStatus($customerName) {
        $url = '/customer/account/' . $customerName . '/status';

        return $this->makeRequestApi($url, 'POST');
    }
}
