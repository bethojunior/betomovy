<?php

namespace App\Utils\Pay704;

use App\Contracts\Checkout\CheckoutInterface;
use App\Contracts\DTO\AbstractDTO;
use App\Utils\Pay704\DTO\Payment\CapturePaymentDTO;
use App\Utils\Pay704\DTO\StoreSubCompanyDTO;
use App\Utils\Pay704\Exceptions\NoResponseFromServerException;
use App\Utils\Pay704\Exceptions\Pay704Exception;
use App\Utils\Pay704\Exceptions\ServerErrorException;
use App\Utils\Pay704\Traits\Pay704ResponseValidator;

class Checkout704Pay implements CheckoutInterface
{
    use Pay704ResponseValidator;
    private string $url;
    private string $apiId;
    private string $apiSecret;

    public function __construct(string $apiId, string $apiSecret)
    {
        $this->url = env('ENV') == 'production' ?
            'https://api.prod.704pay.com.br/v1/' : 'https://704pay-api.dev.704apps.com.br/v1/';
        $this->apiId = $apiId;
        $this->apiSecret = $apiSecret;
    }

    public function getCompanyInfo(string $documentNumber): ?\stdClass
    {
        list(
            'response' => $response
        ) = $this->curlExec('sub_company/' . $documentNumber . '/info', 'GET');

        if (!$response->status) {
            return null;
        }

        return $response->response;
    }

    /**
     * @param StoreSubCompanyDTO $storeSubCompanyDTO
     * @return \stdClass
     * @throws Pay704Exception
     */
    public function storeSubCompany(StoreSubCompanyDTO $storeSubCompanyDTO): \stdClass
    {
        list(
            'response' => $response,
            'httpCode' => $httpCode
        ) = $this->curlExec('sub_company/store', 'POST', $storeSubCompanyDTO);

        // @TODO: capturar os erros de validação de conta bancária
        // @TODO: tratar erros de representative.

        if ($httpCode == 400) {
            if ($response->response->errorCode) {
                $this->validateErrorCode($response->response->errorCode);
            }
        }

        if ($httpCode == 422) {
            $this->validateErrorResponse($response->response);
        }

        return $response->response;
    }

    /**
     * @throws ServerErrorException
     * @throws NoResponseFromServerException
     * @throws Pay704Exception
     */
    public function captureAmount($paymentId, ?float $amount = null): array
    {
        $dto = new CapturePaymentDTO(intval($amount * 100));
        list(
            'response' => $response,
            'httpCode' => $httpCode
        ) = $this->curlExec(
            "payment/sales/{$paymentId}/capture",
            'POST',
            $dto
        );

        if ($httpCode == 400) {
            if ($response->response->errorCode) {
                $this->validateErrorCode($response->response->errorCode);
            }
        }

        if ($httpCode == 422) {
            $this->validateErrorResponse($response->response);
        }

        return (array) $response->response;
    }

    public function setParameters(array $data): CheckoutInterface
    {
        foreach ($data as $key => $value) {
            if (property_exists($this, $key)) {
                $this->$key = $value;
            }
        }

        return $this;
    }

    /**
     * @throws ServerErrorException
     * @throws NoResponseFromServerException
     */
    private function curlExec(string $actionUri, string $method, AbstractDTO $data = null): array
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt(
            $ch,
            CURLOPT_URL,
            $this->url . $actionUri);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Content-Type: application/json",
            "Accept: application/json",
            "id: $this->apiId",
            "secret: $this->apiSecret"
        ]);

        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data->toArray()));
        }

        $response = json_decode(curl_exec($ch));
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        // @TODO: Salvar no log do mongo.
        \Log::info('Checkout704Pay::curlExec', [
            'url' => $this->url . $actionUri,
            'method' => $method,
            'data' => $data,
            'response' => $response,
            'httpCode' => $httpCode
        ]);

        $this->validateResponse($response, $httpCode);

        curl_close($ch);

        return compact('response', 'httpCode');
    }

    /**
     * @throws ServerErrorException
     * @throws NoResponseFromServerException
     */
    private function validateResponse($response, $httpCode): void
    {
        if (!$response) {
            throw new NoResponseFromServerException();
        }

        if ($httpCode == 500) {
            throw new ServerErrorException();
        }
    }

    /**
     * @throws ServerErrorException
     */
    private function validateErrorResponse($response): void
    {
        if (!empty($response->documentNumber)) {
            throw new ServerErrorException();
        }
    }
}
