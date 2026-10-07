<?php

namespace app\utils;

use app\contracts\CheckoutInterface;
use app\exceptions\CheckoutCardException;
use app\exceptions\CheckoutServiceException;
use app\validator\CheckoutValidator704Pay;

class Checkout704Pay implements CheckoutInterface
{
    protected $apiId;
    protected $apiSecret;
    protected $url;
    protected $responseValidator;

    protected $value;
    protected $document;
    protected $phone;
    protected $name;
    protected $email;
    protected $capture;
    protected $card;
    protected $splits;

    public function __construct(string $apiId, string $apiSecret)
    {
        $this->apiId = $apiId;
        $this->apiSecret = $apiSecret;
        $this->responseValidator = new CheckoutValidator704Pay();
        $this->url = env('ENV') == 'production' ?
            'https://api.prod.704pay.com.br/v1/' : 'https://704pay-api.dev.704apps.com.br/v1/';
    }

    public function __get($name)
    {
        return $this->$name ?? 13;
    }

    // Função está em desenvolvimento no ambiente de dev
    // public function pixPayment(int $amount,array $user)
    // {
    //     $currentDate = Carbon::now();
    //     $result =  $this->curlExec(
    //         'payment/sales/pix',
    //         'POST',
    //         [
    //             "amount"=> FormatValue::convertToCents($amount),
    //             "dueDate" => $currentDate->toDateString(),
    //             "customer" => [
    //                 "name" => $user['name'],
    //                 "documentNumber" => FormatValue::formatDocumentClear($user['document']),
    //                 "email" => $user['email']
    //             ],
    //         ]);

    //     if (empty($result['status']) ) {
    //         $this->responseValidator->validateTransactionResponse($result['response'], $result['response']->errorCode);
    //     }

    //     return $result;

    // }

    public function pixPayment(array $data)
    {
        $result = $this->curlExec(
            'payment/sales/pix',
            'POST',
            [
                'amount' => $data['amount'],
                'dueDate' => $data['dueDate'],
                'customer' => $data['customer'],
            ]);

        $this->responseValidator->validateTransactionResponse($result['response']->status, $result['response']->errorCode);

        return $result;
    }

    /**
     * @return array
     *
     * @throws CheckoutServiceException|CheckoutCardException
     */
    public function creditPayment()
    {
        $data = [
            "amount"=> FormatValue::convertToCents($this->value),
            "payment"=> [
                "type" => "credit",
                "installments"=> 1,
                "capture"=> true,
                "card"=> [
                    "vault"=> $this->card['cardId'],
                    "brand" => $this->card['paymentMethodName'],
                ]
            ],
            "customer" => [
                "name" => $this->name,
                "document" => FormatValue::formatDocumentClear($this->document),
                "email" => $this->email,
            ],
        ];

        if (!empty($this->splits)) {
            $data['splits'] = $this->splits;
        }

        $result = $this->curlExec(
            'payment/sales',
            'POST',
            $data
        );

        if (empty($result['status'])) {
            $this->responseValidator->validateTransactionResponse($result['response']->status, $result['response']->errorCode);
        }

        return array_merge($result, ['amount' => $this->value]);
    }

    /**
     * @throws Exception
     */
    public function debitPayment()
    {
        throw new CheckoutServiceException(154);
    }

    public function refundCreditPayment($paymentId, $amount = null)
    {
        $result = $this->curlExec(
            "payment/sales/{$paymentId}/cancel",
            'POST',
            ['amount' => FormatValue::convertToCents($amount)]
        );

        if (empty($result['status'])) {
            $this->responseValidator->validateTransactionResponse($result['response']->status, $result['response']->errorCode);
        }

        return $result;
    }

    /**
     * @throws CheckoutServiceException
     * @throws CheckoutCardException
     */
    public function reserveAmount(): array
    {
        $data = [
            "amount"=> FormatValue::convertToCents($this->value),
            "payment"=> [
                "type" => "credit",
                "installments"=> 1,
                "capture" => false,
                "card"=> [
                    "vault"=> $this->card['cardId'],
                    "brand" => $this->card['paymentMethodName'],
                ]
            ],
            "customer" => [
                "name" => $this->name,
                "document" => FormatValue::formatDocumentClear($this->document),
                "email" => $this->email,
            ],
        ];

        if (!empty($this->splits)) {
            $data['splits'] = $this->splits;
        }

        $result = $this->curlExec(
            'payment/sales',
            'POST',
            $data
        );

        if (empty($result['status'])) {
            $this->responseValidator->validateTransactionResponse($result['response']->status, $result['response']->errorCode);
        }

        return array_merge($result, ['amount' => $this->value]);
    }

    /**
     * @param null $amount
     *
     * @throws Exception
     */
    public function refundDebitPayment($paymentId, $amount = null)
    {
        throw new CheckoutServiceException(154);
    }

    public function findPayment($paymentId)
    {
        $result = $this->curlExec("payment/sales/{$paymentId}", 'GET');

        if (empty($result['status'])) {
            $this->responseValidator->validateTransactionResponse($result['response']->status, $result['response']->errorCode);
        }

        return $result;
    }

    public function findPaymentPix(string $paymentId)
    {
        $result = $this->curlExec('payment/sales/pix/'.$paymentId, 'GET', true);

        if (empty($result['status'])) {
            $this->responseValidator->validateTransactionResponse($result['response']->status, $result['response']->errorCode);
        }

        return $result['response'];
    }

    public function setParameters(array $data): CheckoutInterface
    {
        // TODO: Implement setParameters() method.
        foreach ($data as $key => $value) {
            if (property_exists($this, $key)) {
                $this->$key = $value;
            }
        }

        return $this;
    }

    public function insertCustomer($email, array $options = [])
    {
        // TODO: Implement insertCustomer() method.
    }

    public function insertCard($customerId, $data, $token = null)
    {
        $brand = FormatValue::brandsCard(!empty($data['cardNumber']) ? str_replace(' ', '', $data['cardNumber']) : $data['number']);

        $result = $this->curlExec(
            'payment/vaults/cards',
            'POST',
            [
                'customerName' => $data['user']['name'],
                'customerEmail' => $data['user']['email'],
                'documentNumber' => FormatValue::formatDocumentClear($data['docNumber'] ?? $data['user']['document']),
                'cardNumber' => !empty($data['cardNumber']) ? str_replace(' ', '', $data['cardNumber']) : $data['number'],
                'cardHolderName' => $data['cardholderName'],
                'expirationMonth' => $data['expirationMonth'],
                'expirationYear' => $data['expirationYear'],
                'securityCode' => $data['cvv'],
                'brand' => $brand === 'undefined' ? $data['paymentMethodName'] : $brand,
            ]
        );

        if (empty($result['status'])) {
            if ($result['response']->status !== 'Recusado' && $result['response'][0]) {
                $errorMessage = $this->extractErrorMessage($result['response'][0]);
                $this->responseValidator->validateTransactionResponse($result['response']->status, $errorMessage ? $errorMessage : $result['response']->errorCode);
            }

            $this->responseValidator->validateTransactionResponse($result['response']->status, $result['response']->errorCode);
        }

        return $result;
    }

    public function searchPayment(array $params)
    {
        // TODO: Implement searchPayment() method.
    }

    /**
     * @throws Exception
     */
    public function captureAmount($paymentId, $amount = null)
    {
        $payment = $this->curlExec(
            "payment/sales/{$paymentId}/capture",
            'POST',
            [
                'amount' => FormatValue::convertToCents($amount),
            ]
        );

        if (empty($result['status'])) {
            $this->responseValidator->validateTransactionResponse($payment['response'], $payment['response']->errorCode);
        }

        return $payment;
    }

    private function extractErrorMessage($responseMessage)
    {
        $startPos = strpos($responseMessage, '{"message":"');
        if ($startPos !== false) {
            $startPos += strlen('{"message":"');
            $endPos = strpos($responseMessage, '"}', $startPos);
            if ($endPos !== false) {
                return substr($responseMessage, $startPos, $endPos - $startPos);
            }
        }

        return '';
    }

    private function curlExec($actionUri, $method, $data = null)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt(
            $ch,
            CURLOPT_URL,
            $this->url.$actionUri);

        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_TIMEOUT, 60);

        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'Accept: application/json',
                "id: $this->apiId",
                "secret: $this->apiSecret",
            ]);
        }
        $response = json_decode(curl_exec($ch));
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if (empty($response)) {
            throw new CheckoutServiceException(150, $response);
        }
        if (in_array($httpCode, [401, 403, 500, 0])) {
            throw new CheckoutServiceException(150, $response);
        }

        return get_object_vars($response);
    }

    public function splitPayment($paymentId)
    {
        // TODO: Implement splitPayment() method.
    }

    public function hasSplit(): bool
    {
        return true;
    }

    public function refundPixPayment($paymentId, $amount = null)
    {
        // TODO: Implement captureAmount() method.
    }
}
