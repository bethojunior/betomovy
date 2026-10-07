<?php

namespace Common\Utils;

use App\Constants\Acquirer\AcquirerConst;
use Common\Utils\FormatValue;

class Checkout704Pay
{
    private $apiUrl;
    protected $apiId;
    protected $apiSecret;

    public function __construct(string $apiId,  string $apiSecret)
    {
        $this->apiUrl = 'https://704pay-api.dev.704apps.com.br/v1/';
        $this->apiId = $apiId;
        $this->apiSecret = $apiSecret;
    }

    public function creditPayment(array $dataTransation = [])
    {
        try {
            $result = $this->curlExec(
            'payment/sales',
            'POST',
            [
                "amount"=> FormatValue::convertToCents($dataTransation['value']),
                "payment"=> [
                    "type" => "credit",
                    "installments"=> 1,
                    "capture"=> true,
                    "card"=> [
                        "vault"=> $dataTransation['cardId'],
                        "brand" => $dataTransation['card_brand'],
                        ]
                ],
                "customer" => [
                    "name" => $dataTransation['customer_name'],
                    "document" => FormatValue::formatDocumentClear($dataTransation['customer_document']),
                    "email" => $dataTransation['customer_email'],
                ]
            ]);


            $response = (object)[];
            $response->id_payment = $result["response"]->uuid;
            $response->value = $dataTransation['value'];
            $response->status = "Sucesso";
            $response-> deliveryFinancialIntermediaryId = AcquirerConst::PAY704;

            return $response;

        } catch (\Exception $e) {
            throw  new \Exception($e->getMessage());
        }
    }

    public function cancelCharge(string $paymentId, $amount)
    {
        return $this->curlExec(
            "payment/sales/{$paymentId}/cancel",
            "POST",
            ["amount"=> FormatValue::convertToCents($amount)]
        );
    }

    private function curlExec($actionUri, $method, $data = null)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_URL, $this->apiUrl . $actionUri);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 0);
        curl_setopt($ch, CURLOPT_TIMEOUT, 4000);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);

        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            "id:" . $this->apiId,
            "secret:" . $this->apiSecret,
            "Accept: application/json",
            "Content-Type: application/json",
            "header: ContentType application/json"
        ));

        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }

        $response = curl_exec($ch);
        $response = json_decode($response);
        curl_close($ch);

        if ($response->status === false && $response->response->status === "Recusado" ) {
            throw new \Exception($response->message);
        }

        return $response ? get_object_vars($response) : $response;
    }
}
