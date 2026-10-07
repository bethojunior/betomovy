<?php

namespace app\utils;

use app\constant\FinancialIntermediaryConst;
use app\contracts\CheckoutInterface;
use app\exceptions\CheckoutServiceException;
use app\exceptions\MercadoPagoException;
use app\traits\PaymentWebhook;
use app\utils\HttpBodyMessageExtractor;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 05/12/2018
 * Time: 09:34
 */
class MPCheckout implements CheckoutInterface
{
    use PaymentWebhook;

    const PIX_EXPIRATION_HOURS = 24;

    private $base_url = "https://api.mercadopago.com/v1/";
    private $financialIntermediaryId = FinancialIntermediaryConst::MERCADO_PAGO;


    /**
     * Parametros alimentados pelo setParameters()
     */
    private $value;
    private $description;
    private $mpCustomerId;
    private $mpToken;
    private $access_token;

    /**
     * MPCheckout constructor.
     * @param string $access_token
     */
    public function __construct(string $access_token)
    {
        $this->access_token = $access_token;
    }

    /**
     * @param string $email
     * @param array $options
     * @return array
     * @throws Exception
     */
    public function insertCustomer($email, array $options = [])
    {
        $search = $this->curlExec($this->base_url . 'customers/search?email=' . urlencode($email), 'GET');

        if (!empty($search['results'][0])) {
            return $search['results'][0];
        }

        return $this->curlExec($this->base_url . 'customers', 'POST', array_merge(['email' => $email], $options));
    }

    /**
     * @param $customerId
     * @param $data
     * @param $token
     * @return mixed
     * @throws Exception
     */
    public function insertCard($customerId, $data, $token = null)
    {
        return $this->curlExec($this->base_url . "customers/{$customerId}/cards", 'POST', ['token' => $token]);
    }

    /**
     * @param $paymentId
     * @return mixed
     * @throws CheckoutServiceException
     */
    public function findPayment($paymentId)
    {
        $url = $this->base_url . "payments/{$paymentId}";

        return $this->curlExec($url, 'GET');
    }

    /**
     * @param array $params
     * @return mixed
     */
    public function searchPayment(array $params)
    {
        $query = http_build_query($params);

        return $this->curlExec($this->base_url . "payments/search?{$query}", 'GET');
    }

    /**
     * @return mixed
     * @throws Exception
     */
    public function creditPayment()
    {
        $payment_data = [
            "transaction_amount" => (float) $this->value,
            "token"              => $this->mpToken,
            "description"        => $this->description,
            "installments"       => 1,
            "payment_method_id"  => "master",
            "external_reference" => "PKJNWD1231",
            // "notification_url"   => "https://www.yoursite.com/webhooks",
            "payer"              => [
                "type" => "customer",
                "id"   => $this->mpCustomerId,
            ],
        ];

        $url = $this->base_url . 'payments';

        return $this->curlExec($url, 'POST', $payment_data);
    }

    /**
     * @throws CheckoutServiceException
     */
    public function debitPayment()
    {
        throw new CheckoutServiceException(154);
    }

    /**
     * @param $customerId
     * @param $value
     * @param $token
     * @param $description
     * @return array
     * @throws Exception
     */
    public function reserveAmounts($customerId, $value, $token, $description)
    {
        $payment_data = array(
            "transaction_amount" => (float) $value,
            "token" => $token,
            "description" => $description,
            "installments" => 1,
            "payer" => array(
                "type" => "customer",
                "id" => $customerId
            ),
            "capture" => false
        );

        $url = $this->base_url . "payments";

        return $this->curlExec($url, 'POST', $payment_data);
    }

    public function reserveAmount()
    {
    
        // return $this->curlExec($url, 'POST', $payment_data);
    }

    /**
     * @param $paymentId
     * @return array
     */
    public function cancelReserve($paymentId)
    {
        $payment_data = array(
            "status" => "cancelled"
        );

        $url = $this->base_url . "payments/{$paymentId}";

        return $this->curlExec($url, 'PUT', $payment_data);
    }

    /**
     * @param $paymentId
     * @return array
     * @throws Exception
     */
    public function capturePayment($paymentId)
    {
        $payment_data = array(
            "capture" => true
        );

        $url = $this->base_url . "payments/{$paymentId}";

        return $this->curlExec($url, 'PUT', $payment_data);
    }

    /**
     * @param $paymentId
     * @param null $amount
     * @return mixed
     * @throws CheckoutServiceException
     */
    public function refundCreditPayment($paymentId, $amount = null)
    {
        $this->curlExec($this->base_url . "payments/{$paymentId}/refunds", 'POST');

        return $this->curlExec($this->base_url . "payments/{$paymentId}", 'GET');
    }

    /**
     * @param $paymentId
     * @param null $amount
     * @throws CheckoutServiceException
     */
    public function refundDebitPayment($paymentId, $amount = null)
    {
        throw new CheckoutServiceException(154);
    }


    public function __get($name)
    {
        // TODO: Implement __get() method.
        return $this->$name ?? null;
    }

    private function curlExec(string $url, string $method, $data = null): array
    {
        $ch = curl_init();

        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_URL            => $url,
            CURLOPT_CUSTOMREQUEST  => $method,
            CURLOPT_HTTPHEADER     => [
                'Content-Type: application/json',
                'Accept: application/json',
                'Authorization: Bearer ' . $this->access_token,
            ],
            CURLOPT_TIMEOUT        => 30,
        ]);

        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }

        $raw       = curl_exec($ch);
        $httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        return $this->parseResponse($httpCode, $curlError, $raw);
    }

    private function parseResponse(int $httpCode, string $curlError, $raw): array
    {
        if ($curlError !== '') {
            throw new MercadoPagoException("Transport error: {$curlError}");
        }

        $decoded = json_decode((string) $raw, true);
        $body    = is_array($decoded) ? $decoded : [];

        if ($httpCode < 200 || $httpCode >= 300) {
            $message = HttpBodyMessageExtractor::extract($body, (string) $raw);
            throw new MercadoPagoException("HTTP {$httpCode}: {$message}", $httpCode, $body ?: null);
        }

        if ($raw === false || $raw === '' || $raw === null) {
            throw new MercadoPagoException("Empty response body", $httpCode);
        }

        return $body;
    }

    public function setParameters(array $data): CheckoutInterface
    {
        // TODO: Implement setParameters() method.
        foreach ($data as $key => $value) {
            if (property_exists($this, $key))
                $this->$key = $value;
        }

        return $this;
    }

    public function captureAmount($paymentId, $amount = null)
    {
        // TODO: Implement captureAmount() method.
    }

    public function hasSplit(): bool
    {
        return false;
    }

    public function splitPayment($paymentId)
    {
        throw new CheckoutServiceException(157);
    }

    public function refundPixPayment($paymentId, $amount = null)
    {
        $url = $this->base_url . "payments/{$paymentId}/refunds";
        return $this->curlExec($url, 'POST');
    }

    public function pixPayment(array $data)
    {
        $customer = $data['customer'] ?? [];
        $amount   = isset($data['amount']) ? (float) $data['amount'] / 100 : 0.0;
        $document = preg_replace('/\D/', '', $customer['documentNumber'] ?? '');

        $payload = [
            'transaction_amount' => $amount,
            'payment_method_id'  => 'pix',
            'payer'              => [
                'first_name'     => $customer['name'] ?? '',
                'email'          => $customer['email'] ?? '',
                'identification' => [
                    'type'   => 'CPF',
                    'number' => $document,
                ],
            ],
        ];

        $expiresAt = new \DateTime('+' . self::PIX_EXPIRATION_HOURS . ' hours');
        $payload['date_of_expiration'] = $expiresAt->format('Y-m-d\TH:i:s.000P');

        if ($this->hasWebhookUrl()) {
            $payload['notification_url'] = $this->webhookUrl('paymentwebhook/mpwebhook');
        }

        $url = $this->base_url . 'payments';

        return $this->curlExec($url, 'POST', $payload);
    }

    public function findPaymentPix(string $paymentId)
    {
        $url      = $this->base_url . "payments/{$paymentId}";
        $response = $this->curlExec($url, 'GET');

        return json_decode(json_encode($response));
    }
}