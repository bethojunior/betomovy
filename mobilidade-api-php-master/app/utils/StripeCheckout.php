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
    private $financialIntermediaryId = FinancialIntermediaryConst::STRIPE;

    private $value;
    private $description;
    private $customerId;
    private $stripeToken;
    private $parameters = [];

    public function __construct(string $secretKey, ?string $publishableKey = null)
    {
        $this->secretKey = trim($secretKey);
        $this->publishableKey = $publishableKey ? trim($publishableKey) : null;
        if ($this->secretKey === '') {
            throw new Exception('Stripe: secret_key vazia. Configure a chave no adquirente (Monitor/Central).');
        }
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
        $this->customerId = $data['customerId']
            ?? ($data['card']['CustomerId'] ?? null)
            ?? ($data['card']['mpCustomerId'] ?? null);

        $token = $data['stripeToken'] ?? $data['mpToken'] ?? null;
        // Aceita apenas tokens/PM Stripe válidos; evita token MP quebrando o PaymentIntent
        if (is_string($token) && preg_match('/^(pm_|tok_|card_)/', $token)) {
            $this->stripeToken = $token;
        } else {
            $this->stripeToken = $data['card']['cardId']
                ?? $data['cardId']
                ?? (is_string($token) ? $token : null);
            if (is_string($this->stripeToken) && !preg_match('/^(pm_|tok_|card_)/', $this->stripeToken)) {
                $this->stripeToken = $data['card']['cardId'] ?? null;
            }
        }
        return $this;
    }

    public function creditPayment()
    {
        $amountInCents = (int) round(((float) $this->value) * 100);
        // Reserva (manual) na criação da viagem; captura real em finishPayment/captureAmount
        $captureMethod = !empty($this->parameters['capture']) ? 'automatic' : 'manual';
        $payload = [
            'amount' => $amountInCents,
            'currency' => 'brl',
            'description' => $this->description,
            'capture_method' => $captureMethod,
            'confirm' => 'true',
            'off_session' => 'true',
            'payment_method_types[0]' => 'card',
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
        } elseif (!empty($this->parameters['card']['cardId'])) {
            $payload['payment_method'] = $this->parameters['card']['cardId'];
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
            'off_session' => 'true',
            'payment_method_types[0]' => 'card',
            'metadata[sale_id]' => (string) ($this->parameters['sale_id'] ?? ''),
            'metadata[trip_reference]' => (string) ($this->parameters['sale_id'] ?? '')
        ];

        if (!empty($this->customerId)) {
            $payload['customer'] = $this->customerId;
        }

        $paymentMethod = $this->stripeToken 
            ?? $this->parameters['cardId'] 
            ?? $this->parameters['card']['cardId'] 
            ?? null;

        if (!empty($paymentMethod)) {
            $payload['payment_method'] = $paymentMethod;
        }

        return $this->curlExec('payment_intents', 'POST', $payload);
    }

    public function captureAmount($paymentId, $amount = null)
    {
        try {
            $current = $this->findPayment($paymentId);
            $status = $current['status'] ?? '';
            if (in_array($status, ['succeeded', 'canceled'], true)) {
                return $current;
            }
        } catch (\Throwable $e) {
            // segue para tentar capturar
        }

        $payload = [];
        if (!empty($amount)) {
            $payload['amount_to_capture'] = (int) round(((float) $amount) * 100);
        }
        return $this->curlExec("payment_intents/{$paymentId}/capture", 'POST', $payload);
    }

    public function refundCreditPayment($paymentId, $amount = null)
    {
        // PI só autorizado (requires_capture): cancelar em vez de refund
        try {
            $current = $this->findPayment($paymentId);
            $status = $current['status'] ?? '';
            if (in_array($status, ['requires_capture', 'requires_confirmation', 'requires_action', 'requires_payment_method'], true)) {
                return $this->curlExec("payment_intents/{$paymentId}/cancel", 'POST', []);
            }
            if ($status === 'canceled') {
                return $current;
            }
        } catch (\Throwable $e) {
            // segue para tentar refund
        }

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
            $attached = $this->curlExec("payment_methods/{$token}/attach", 'POST', [
                'customer' => $customerId
            ]);

            // Set as default payment method for the customer
            try {
                $this->curlExec("customers/{$customerId}", 'POST', [
                    'invoice_settings[default_payment_method]' => $token
                ]);
            } catch (\Throwable $e) {}

            return $attached;
        }

        // Se dados brutos do cartão foram enviados
        if (!empty($data['number']) && !empty($data['expirationMonth']) && !empty($data['expirationYear'])) {
            $cardPayload = [
                'type' => 'card',
                'card[number]' => str_replace(' ', '', (string)$data['number']),
                'card[exp_month]' => (int)$data['expirationMonth'],
                'card[exp_year]' => (int)$data['expirationYear'],
            ];
            if (!empty($data['cvv'])) {
                $cardPayload['card[cvc]'] = (string)$data['cvv'];
            }
            if (!empty($data['cardholderName'])) {
                $cardPayload['billing_details[name]'] = (string)$data['cardholderName'];
            }

            $pm = $this->curlExec('payment_methods', 'POST', $cardPayload);
            if (!empty($pm['id'])) {
                $this->curlExec("payment_methods/{$pm['id']}/attach", 'POST', [
                    'customer' => $customerId
                ]);
                try {
                    $this->curlExec("customers/{$customerId}", 'POST', [
                        'invoice_settings[default_payment_method]' => $pm['id']
                    ]);
                } catch (\Throwable $e) {}
                return $pm;
            }
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
        $key = trim($secretKey);
        $isRestricted = strpos($key, 'rk_') === 0;
        $isSecret = strpos($key, 'sk_') === 0;

        if ($code >= 200 && $code < 300) {
            $msg = 'Conexão com a Stripe realizada com sucesso!';
            if ($isRestricted) {
                $msg .= ' Atenção: chave rk_ (restricted) detectada. Para criar cartões e PaymentIntents use sk_live_/sk_test_ com permissões completas, ou libere PaymentMethods + PaymentIntents na chave restrita.';
            }
            return [
                'status' => true,
                'message' => $msg,
                'data' => $json,
                'key_type' => $isRestricted ? 'restricted' : ($isSecret ? 'secret' : 'unknown'),
            ];
        }

        return [
            'status' => false,
            'message' => $json['error']['message'] ?? 'Falha ao autenticar com as credenciais da Stripe.',
            'error' => $json,
            'key_type' => $isRestricted ? 'restricted' : ($isSecret ? 'secret' : 'unknown'),
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
