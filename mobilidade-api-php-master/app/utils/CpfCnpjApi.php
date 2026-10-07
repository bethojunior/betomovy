<?php

namespace app\utils;

use app\exceptions\CpfCnpjApiException;
use app\model\ExternalServiceMetaData;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 12/08/2019
 * Time: 10:40
 */
class CpfCnpjApi
{
    private $base_url = "https://api.cpfcnpj.com.br/";
    private $cityId;
    private $api_token;

    const PACKAGE_ID = 2;

    public function __construct(int $cityId = null)
    {
        $this->cityId = $cityId;
    }

    private function loadApiKey()
    {
        $this->api_token = ExternalServiceMetaData::get('cpfcnpj_token', $this->cityId);
    }

    /**
     * @param $cpf
     * @return mixed
     * @throws CpfCnpjApiException
     */
    public function cpfQuery($cpf)
    {
        $this->loadApiKey();

        if (!$this->api_token) {
            throw new CpfCnpjApiException(1620);
        }

        $cpf = FormatValue::formatDocumentClear($cpf);

        $response = $this->request($cpf);

        $this->responseIsValid($response);

        return $response;
    }

    private function request($document)
    {
        $url =
            $this->base_url .
            $this->api_token . '/' .
            self::PACKAGE_ID . '/' .
            $document;

        $ch = curl_init(str_replace(
            ' ', '', $url));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        curl_close($ch);

        return json_decode($response);
    }

    /**
     * @param $response
     * @throws CpfCnpjApiException
     */
    private function responseIsValid($response)
    {
        if (!$response)
            throw new CpfCnpjApiException(1620, $response);

        if ($response->status == 0)
            throw new CpfCnpjApiException(1621, $response);
    }
}