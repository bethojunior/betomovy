<?php

namespace app\utils;

use app\contracts\CheckoutInterface;
use app\constant\FinancialIntermediaryConst;
use app\exceptions\CheckoutServiceException;
use app\traits\PaymentWebhook;

/**
 * Adapter de integração da 704apps com a YumePay.
 *
 * Modelo atual (conforme yumepay-v2):
 * - POST /api/v1/online/sales/pre-capture/  -> cria preauth (PRE_CAPTURED)
 * - PUT  /api/v1/online/sales/<pk>/capture/ -> captura (CONFIRMED)
 * - PUT  /api/v1/online/sales/<pk>/cancel-capture/ -> cancela preauth
 *
 * Observação importante:
 * - No padrão da 704apps, iremos gravar `generatedPaymentId` como o `online_sale_id` (pk).
 */
class YumePayCheckout implements CheckoutInterface
{
    use PaymentWebhook;
    
    // Não remover: usado no CheckoutIntermediaryService
    private int $financialIntermediaryId = FinancialIntermediaryConst::YUMEPAY;

    /**
     * Base URL padrão (docker: container -> container).
     * Pode ser sobrescrita via ENV `YUMEPAY_BASE_URL`.
     */
    private const DEFAULT_BASE_URL = 'https://yumepay-v2-78574947f85b.herokuapp.com/';

    private string $baseUrl;
    private ?string $apiToken;

    /** parâmetros setParameters() */
    private $value;
    private $description;
    private $capture;
    private $card;
    private $document;
    private $email;
    private $phone;
    private $name;

    /**
     * - Base URL: ENV `YUMEPAY_BASE_URL` (fallback: DEFAULT_BASE_URL)
     * - Token: vem do `acquirerMetaData` (key: `yume_api_token`)
     */
    public function __construct(?string $apiToken = null, ?string $baseUrl = null)
    {
        $baseUrl = $baseUrl ?: (env('YUMEPAY_BASE_URL') ?: self::DEFAULT_BASE_URL);
        $this->baseUrl = rtrim((string) $baseUrl, '/') . '/';
        $this->apiToken = $apiToken ?: null;
    }

    public function __get($name)
    {
        return $this->$name ?? null;
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
     * Pagamento crédito com captura imediata (quando $this->capture === true).
     * Se $this->capture estiver false, o CheckoutService chama reserveAmount() em vez disso.
     */
    public function creditPayment()
    {
        // preauth
        $pre = $this->reserveAmount();

        // se for captura imediata, captura agora
        $shouldCapture = (bool) $this->capture;
        if ($shouldCapture) {
            $capture = $this->captureAmount($pre['data']['online_sale_id']);

            return [
                'status' => 'success',
                'data' => [
                    'online_sale_id' => $pre['data']['online_sale_id'],
                    'sale_status' => $capture['data']['sale_status'] ?? 'CONFIRMED',
                ],
                'meta' => [
                    'pre_capture' => $pre,
                    'capture' => $capture,
                ],
            ];
        }

        return $pre;
    }

    /**
     * Débito: a YumePay deve expor fluxo equivalente.
     * Por ora, tentamos usar o mesmo preauth+capture (se suportado) ou falhamos.
     */
    public function debitPayment()
    {
        // Mantemos o mesmo contrato do CheckoutService (pode chamar debitPayment diretamente)
        // Se a YumePay ainda não suportar, o erro será propagado como 150/154 conforme necessário.
        return $this->creditPayment();
    }

    /**
     * Pré-autorização (pre-capture).
     */
    public function reserveAmount()
    {
        $this->assertCardPayload();

        $valueInCents = (int) round(((float) $this->value) * 100);

        $payload = [
            'value' => $valueInCents,
            // dados do cartão (YumePay atual recebe PAN/CVV)
            'card_number' => (string) ($this->card['number'] ?? ''),
            'cvv' => (string) ($this->card['cvv'] ?? ''),
            'exp_month' => (string) ($this->card['expirationMonth'] ?? ''),
            'exp_year' => (string) ($this->card['expirationYear'] ?? ''),
            'card_holder' => (string) ($this->card['cardholderName'] ?? ($this->name ?? '')),
        ];

        $res = $this->httpJson('POST', 'api/v1/online/sales/pre-capture/', $payload);

        if (($res['http_code'] ?? 0) !== 200 || ($res['body']['status'] ?? null) !== 'success') {
            throw new CheckoutServiceException(150, [
                'http_code' => $res['http_code'] ?? null,
                'body' => $res['body'] ?? null,
            ]);
        }

        // Enriquecemos com o request original para permitir feed de Transaction com valor.
        return array_merge(
            $res['body'],
            [
                'meta' => [
                    'pre_capture' => [
                        'request' => $payload,
                        'http_code' => $res['http_code'] ?? null,
                    ],
                    'amount' => [
                        'cents' => $valueInCents,
                        'value' => ((float) $this->value),
                    ],
                ],
            ]
        );
    }

    public function captureAmount($paymentId, $amount = null)
    {
        $pk = urlencode((string) $paymentId);
        $res = $this->httpJson('PUT', "api/v1/online/sales/{$pk}/capture/");

        if (($res['http_code'] ?? 0) !== 200 || ($res['body']['status'] ?? null) !== 'success') {
            throw new CheckoutServiceException(150, [
                'http_code' => $res['http_code'] ?? null,
                'body' => $res['body'] ?? null,
            ]);
        }

        return $res['body'];
    }

    /**
     * Cancelamento de preauth (equivalente ao "void/cancel" antes de capturar).
     */
    public function refundCreditPayment($paymentId, $amount = null)
    {
        $pk = urlencode((string) $paymentId);
        $res = $this->httpJson('PUT', "api/v1/online/sales/{$pk}/cancel-capture/");

        if (($res['http_code'] ?? 0) !== 200 || ($res['body']['status'] ?? null) !== 'success') {
            throw new CheckoutServiceException(150, [
                'http_code' => $res['http_code'] ?? null,
                'body' => $res['body'] ?? null,
            ]);
        }

        return $res['body'];
    }

    public function refundDebitPayment($paymentId, $amount = null)
    {
        // Mantém compatibilidade: por enquanto, mesma operação do crédito (void).
        return $this->refundCreditPayment($paymentId, $amount);
    }

    public function findPayment($paymentId)
    {
        return $this->findPaymentPix((string) $paymentId);
    }

    public function insertCustomer($email, array $options = [])
    {
        // Não utilizado no fluxo atual da 704apps para YumePay.
        return ['id' => null];
    }

    public function insertCard($customerId, $data, $token = null)
    {
        // A YumePay v2 que analisamos não expõe tokenização/vault M2M.
        // A 704apps pode armazenar o cartão localmente (tabela card) e enviar PAN/CVV no pre-capture.
        throw new CheckoutServiceException(150, [
            'message' => 'YumePay insertCard não implementado (vault/tokenização não disponível).',
        ]);
    }

    public function searchPayment(array $params)
    {
        throw new CheckoutServiceException(150, [
            'message' => 'YumePay searchPayment não implementado.',
            'params' => $params,
        ]);
    }

    public function splitPayment($paymentId)
    {
        throw new CheckoutServiceException(157, [
            'message' => 'Split não implementado na YumePay.',
            'paymentId' => $paymentId,
        ]);
    }

    public function hasSplit(): bool
    {
        return false;
    }

    public function pixPayment(array $data)
    {
        Logger::info("YumepayCheckout pixPayment started");

        $name = (string) ($data['customer']['name'] ?? 'Cliente');
        $document = $data['customer']['documentNumber'] ?? null;
        $email = $data['customer']['email'] ?? null;
        $webhookUrl = $this->webhookUrl('paymentwebhook/yumepaywebhook');

        Logger::info("YumepayCheckout pixPayment webhookurl: " . $webhookUrl);

        $payload = [
            'payment_type' => 'PIX',
            'value' => (int) ($data['amount'] ?? 0),
            'card_holder' => $name,
            'document' => $document,
            'email' => $email,
            // Mantém compatibilidade com diferentes nomes de campo no backend da YumePay.
            'webhookUrl' => $webhookUrl,
            'webhook_url' => $webhookUrl,
            'callbackUrl' => $webhookUrl,
        ];

        $res = $this->httpJson('POST', 'api/v1/online/sales/pre-capture/', $payload);
        $body = $res['body'] ?? [];

        if (($res['http_code'] ?? 0) !== 200 || ($body['status'] ?? null) !== 'success') {
            throw new CheckoutServiceException(150, [
                'http_code' => $res['http_code'] ?? null,
                'body' => $body,
            ]);
        }

        return [
            'status' => 'success',
            'data' => $body['data'] ?? [],
            'meta' => [
                'request' => $payload,
            ],
        ];
    }

    public function findPaymentPix(string $paymentId)
    {
        $pk = urlencode((string) $paymentId);
        $res = $this->httpJson('GET', "api/v1/online/sales/{$pk}/pix/status/");
        $body = $res['body'] ?? [];

        if (($res['http_code'] ?? 0) !== 200 || ($body['status'] ?? null) !== 'success') {
            throw new CheckoutServiceException(150, [
                'http_code' => $res['http_code'] ?? null,
                'body' => $body,
            ]);
        }

        return json_decode(json_encode($body['data'] ?? []));
    }

    public function refundPixPayment(string $paymentId, $amount = null)
    {
        $pk = urlencode((string) $paymentId);
        $payload = is_null($amount) ? null : ['value' => (int) $amount];

        $res = $this->httpJson('PUT', "api/v1/online/sales/{$pk}/pix/cancel/", $payload);
        $body = $res['body'] ?? [];

        if (($res['http_code'] ?? 0) !== 200 || ($body['status'] ?? null) !== 'success') {
            throw new CheckoutServiceException(150, [
                'http_code' => $res['http_code'] ?? null,
                'body' => $body,
            ]);
        }

        $pixPayload =
            $body['data']['pix_payload']
            ?? $body['pix_payload']
            ?? $body['qrCodeContent']
            ?? null;

        $pixQrCode =
            $body['data']['pix_qr_code']
            ?? $body['pix_qr_code']
            ?? $body['qrCode']
            ?? null;

        $data = isset($body['data']) && is_array($body['data']) ? $body['data'] : [];

        if (!empty($pixPayload) && empty($data['pix_payload'])) {
            $data['pix_payload'] = $pixPayload;
        }
        if (!empty($pixQrCode) && empty($data['pix_qr_code'])) {
            $data['pix_qr_code'] = $pixQrCode;
        }
        if (!empty($pixPayload) && empty($data['qrCodeContent'])) {
            $data['qrCodeContent'] = $pixPayload;
        }
        if (!empty($pixQrCode) && empty($data['qrCode'])) {
            $data['qrCode'] = $pixQrCode;
        }

        $body['data'] = $data;
        $body['pix_payload'] = $body['pix_payload'] ?? ($data['pix_payload'] ?? null);
        $body['pix_qr_code'] = $body['pix_qr_code'] ?? ($data['pix_qr_code'] ?? null);
        $body['qrCodeContent'] = $body['qrCodeContent'] ?? ($data['qrCodeContent'] ?? null);
        $body['qrCode'] = $body['qrCode'] ?? ($data['qrCode'] ?? null);

        return $body;
    }

    private function httpJson(string $method, string $path, ?array $data = null): array
    {
        $url = $this->baseUrl . ltrim($path, '/');

        $ch = curl_init();

        $headers = [
            'Content-Type: application/json',
            'Accept: application/json',
        ];

        if (!empty($this->apiToken)) {
            $headers[] = 'Authorization: Bearer ' . $this->apiToken;
        }

        $options = [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => strtoupper($method),
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_TIMEOUT => 60,
        ];

        if (!is_null($data)) {
            $options[CURLOPT_POSTFIELDS] = json_encode($data);
        }

        curl_setopt_array($ch, $options);
        $raw = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        return [
            'success' => $error === '',
            'http_code' => $httpCode,
            'body' => json_decode((string) $raw, true),
            'error' => $error,
        ];
    }

    private function assertCardPayload(): void
    {
        if (empty($this->card) || !is_array($this->card)) {
            throw new CheckoutServiceException(153, ['card' => $this->card]);
        }

        // campos mínimos para pre-capture
        $required = ['number', 'cvv', 'expirationMonth', 'expirationYear', 'cardholderName'];
        foreach ($required as $key) {
            if (empty($this->card[$key])) {
                throw new CheckoutServiceException(153, [
                    'missing' => $key,
                    'card' => $this->card,
                ]);
            }
        }
    }
}

