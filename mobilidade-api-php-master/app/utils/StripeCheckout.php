<?php

namespace app\utils;

use app\constant\FinancialIntermediaryConst;
use app\contracts\CheckoutInterface;
use app\exceptions\CheckoutServiceException;
use Exception;

class StripeCheckout implements CheckoutInterface
{
    const BASE_URL = 'https://api.stripe.com/v1/';

    private string $secretKey;
    private ?string $publishableKey;
    private $financialIntermediaryId = 6; // Stripe

    private $value;
    private $description;
    private $customerId;
    private $stripeToken;
    private $parameters = [];

    public function __construct(string $secretKey, ?string $publishableKey = null)
    {
        $this->secretKey = trim($secretKey);
        $this->publishableKey = $publishableKey ? trim($publishableKey) : null;
    }

    public function __get($name)
    {
        if (isset($this->$name)) {
            return $this->$name;
        }
        return null;
    }

    public function setParameters(array $data): CheckoutInterface
    {
        $this->parameters = $data;
        $this->value = $data['value'] ?? 0;
        $this->description = $data['description'] ?? 'MOVY Viagem';
        $this->customerId = $data['customerId'] ?? null;
        $this->stripeToken = $data['stripeToken'] ?? $data['mpToken'] ?? null;
        return $this;
    }

    public function creditPayment()
    {
        $amountInCents = (int) round(((float) $this->value) * 100);
        $payload = [
            'amount' => $amountInCents,
            'currency' => 'brl',
            'description' => $this->description,
            'capture_method' => 'automatic',
            'confirm' => 'true',
            'metadata[sale_id]' => (string) ($this->parameters['sale_id'] ?? ''),
            'metadata[trip_reference]' => (string) ($this->parameters['sale_id'] ?? '')
        ];

        if (!empty($this->customerId)) {
            $payload['customer'] = $this->customerId;
        }

        if (!empty($this->stripeToken)) {
            $payload['payment_method'] = $this->stripeToken;
        } elseif (!empty($this->parameters['cardId'])) {
            $payload['payment_method'] = $this->parameters['cardId'];
        }

        $res = $this->curlExec('payment_intents', 'POST', $payload);
        return $res;
    }

    public function debitPayment()
    {
        return $this->creditPayment();
    }

    public function reserveAmount()
    {
        $amountInCents = (int) round(((float) $this->value) * 100);
        $payload = [
            'amount' => $amountInCents,
            'currency' => 'brl',
            'description' => $this->description,
            'capture_method' => 'manual',
            'confirm' => 'true',
            'metadata[sale_id]' => (string) ($this->parameters['sale_id'] ?? ''),
        ];

        if (!empty($this->customerId)) {
            $payload['customer'] = $this->customerId;
        }

        if (!empty($this->stripeToken)) {
            $payload['payment_method'] = $this->stripeToken;
        }

        return $this->curlExec('payment_intents', 'POST', $payload);
    }

    public function captureAmount($paymentId, $amount = null)
    {
        $payload = [];
        if (!empty($amount)) {
            $payload['amount_to_capture'] = (int) round(((float) $amount) * 100);
        }
        return $this->curlExec("payment_intents/{$paymentId}/capture", 'POST', $payload);
    }

    public function refundCreditPayment($paymentId, $amount = null)
    {
        $payload = [
            'payment_intent' => $paymentId
        ];
        if (!empty($amount)) {
            $payload['amount'] = (int) round(((float) $amount) * 100);
        }
        return $this->curlExec('refunds', 'POST', $payload);
    }

    public function refundDebitPayment($paymentId, $amount = null)
    {
        return $this->refundCreditPayment($paymentId, $amount);
    }

    public function refundPixPayment(string $paymentId, $amount = null)
    {
        return $this->refundCreditPayment($paymentId, $amount);
    }

    public function findPayment($paymentId)
    {
        return $this->curlExec("payment_intents/{$paymentId}", 'GET');
    }

    public function searchPayment(array $params)
    {
        $query = http_build_query($params);
        return $this->curlExec("payment_intents?{$query}", 'GET');
    }

    public function insertCustomer($email, array $options = [])
    {
        $search = $this->curlExec('customers/search?query=' . urlencode("email:'" . $email . "'"), 'GET');
        if (!empty($search['data'][0])) {
            return $search['data'][0];
        }

        $payload = array_merge(['email' => $email], $options);
        return $this->curlExec('customers', 'POST', $payload);
    }

    public function insertCard($customerId, $data, $token = null)
    {
        if ($token) {
            return $this->curlExec("payment_methods/{$token}/attach", 'POST', [
                'customer' => $customerId
            ]);
        }
        return null;
    }

    public function splitPayment($paymentId)
    {
        return null;
    }

    public function hasSplit(): bool
    {
        return false;
    }

    public function pixPayment(array $data)
    {
        $amountInCents = (int) round(((float) ($data['amount'] ?? $data['value'] ?? 0)) * 100);
        $payload = [
            'amount' => $amountInCents,
            'currency' => 'brl',
            'payment_method_types[0]' => 'pix',
            'description' => $data['description'] ?? 'MOVY Viagem PIX'
        ];
        return $this->curlExec('payment_intents', 'POST', $payload);
    }

    public function findPaymentPix(string $paymentId)
    {
        return $this->findPayment($paymentId);
    }

    public static function testConnection(string $secretKey): array
    {
        $ch = curl_init(self::BASE_URL . 'balance');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . trim($secretKey)
            ],
            CURLOPT_TIMEOUT => 15
        ]);
        $raw = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $json = json_decode($raw, true);
        if ($code >= 200 && $code < 300) {
            return [
                'status' => true,
                'message' => 'Conexão com a Stripe realizada com sucesso!',
                'data' => $json
            ];
        }

        return [
            'status' => false,
            'message' => $json['error']['message'] ?? 'Falha ao autenticar com as credenciais da Stripe.',
            'error' => $json
        ];
    }

    private function curlExec(string $endpoint, string $method, array $data = []): array
    {
        $url = self::BASE_URL . ltrim($endpoint, '/');
        $ch = curl_init();

        $headers = [
            'Authorization: Bearer ' . $this->secretKey,
            'Accept: application/json',
        ];

        $opts = [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_CUSTOMREQUEST => $method,
        ];

        if (strtoupper($method) === 'POST') {
            $opts[CURLOPT_POSTFIELDS] = http_build_query($data);
            $headers[] = 'Content-Type: application/x-www-form-urlencoded';
        }

        $opts[CURLOPT_URL] = $url;
        $opts[CURLOPT_HTTPHEADER] = $headers;

        curl_setopt_array($ch, $opts);
        $raw = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $err = curl_error($ch);
        curl_close($ch);

        if ($err) {
            throw new Exception("Erro de conexão com a Stripe: {$err}");
        }

        $res = json_decode($raw, true) ?? [];
        if ($code >= 400) {
            $msg = $res['error']['message'] ?? "Erro HTTP {$code} retornado pela Stripe";
            throw new Exception("Stripe: {$msg}");
        }

        return $res;
    }
}
