<?php

namespace app\utils;

use app\constant\FinancialIntermediaryConst;
use app\constant\TransactionConst;
use app\contracts\CheckoutInterface;
use app\exceptions\CheckoutServiceException;
use app\traits\PaymentWebhook;
use app\utils\UUID;

class FBCheckout implements CheckoutInterface
{
  use PaymentWebhook;
  
  // Não remover esta constante, é utilizada para identificar o intermediário financeiro no "feedTransaction"
  private $financialIntermediaryId = FinancialIntermediaryConst::FIREBANKING;
  private $sale_id;
  private $value;
  private $description;
  private $api_key;
  private $api_secret;
  private $card;
  private $phone;
  private $email;
  private $baseURL = "https://api.webpague.com.br/v1/";


  public function __construct($configs = [])
  {
    $this->api_key = $configs["firebanking_api_key"];
    $this->api_secret = $configs["firebanking_api_secret"];
  }

  public function __get($name)
  {
    return $this->$name ?? null;
  }

  public function creditPayment()
  {
    $this->assertCardPayload();

    $payload = [
      'amount' => (float) $this->value,
      'client' => [
        'name' => $this->card["cardholderName"],
        'document' => $this->removeAccents($this->card["holderDocument"]),
        'email' => $this->email,
        'address' => [
          "street" => "Rua Desembargador Moreira",
          "city" => "Fortaleza",
          "state" => "CE",
          "postalCode" => "60170001",
          "neighborhood" => "Aldeota",
        ]
      ],
      'paymentMethod' => "credit_card",
      "creditCard" => [
        "cardNumber"      => $this->card["number"],
        "holderName"      => $this->card["cardholderName"],
        "expirationMonth" => str_pad($this->card["expirationMonth"], 2, "0", STR_PAD_LEFT),
        "expirationYear"  => $this->card["expirationYear"],
        "securityCode"    => $this->card["cvv"],
        "brand"           => $this->identifyBrand($this->card["number"]),
        "installments"    => 1
      ],
      'metadata' => (object) [],
      'externalId' => UUID::v4(),
    ];

    $response = $this->request("POST", "invoices/recipient", $payload);
    return $this->normalizeInvoiceStatus($response);
  }

  public function debitPayment()
  {
    // Implementação do pagamento a débito
  }

  public function reserveAmount()
  {
    $this->assertCardPayload();

    $payload = [
      'amount' => (float) $this->value,
      'client' => [
        'name' => $this->card["cardholderName"],
        'document' => $this->removeAccents($this->card["holderDocument"]),
        'email' => $this->email,
        'address' => [
          "street" => "Rua Desembargador Moreira",
          "city" => "Fortaleza",
          "state" => "CE",
          "postalCode" => "60170001",
          "neighborhood" => "Aldeota",
        ]
      ],
      'paymentMethod' => "credit_card",
      "creditCard" => [
        "cardNumber"      => $this->card["number"],
        "holderName"      => $this->card["cardholderName"],
        "expirationMonth" => str_pad($this->card["expirationMonth"], 2, "0", STR_PAD_LEFT),
        "expirationYear"  => $this->card["expirationYear"],
        "securityCode"    => $this->card["cvv"],
        "brand"           => $this->identifyBrand($this->card["number"]),
        "installments"    => 1
      ],
      'metadata' => (object) [],
      'externalId' => UUID::v4(),
    ];

    $response = $this->request("POST", "invoices/recipient", $payload);
    return $this->normalizeInvoiceStatus($response);
  }

  public function pixPayment(array $data)
  {
    $customer = $data['customer'];
    $document = preg_replace('/\D/', '', $customer['documentNumber']);

    $amountInCents = (int) $data['amount'];
    $amount = $amountInCents / 100;

    $payload = [
      'amount' => $amount,
      'client' => [
        'name' => $this->normalizeFullName($customer['name']),
        'document' => $document,
        'email' => $customer['email'],
      ],
      'paymentMethod' => 'pix',
      'metadata' => (object) [],
      'externalId' => UUID::v4(),
      'webhookUrl' => $this->webhookUrl('paymentwebhook/fbwebhook'),
    ];

    $response = $this->request("POST", "invoices/recipient", $payload);
    return $this->normalizeInvoiceStatus($response);
  }

  public function findPaymentPix(string $paymentId)
  {
    $response = $this->request("GET", "invoices/recipient/" . $paymentId);
    return $this->normalizeInvoiceStatus($response);
  }

  public function refundPixPayment($paymentId, $amount = null)
  {
    $response = $this->request("PATCH", "invoices/recipient/refund/" . $paymentId);
    return $this->extractInvoiceFromRefund($response);
  }

  public function captureAmount($paymentId, $amount = null)
  {
    // Implementação de pesquisa de pagamento
  }

  public function refundCreditPayment($paymentId, $amount = null)
  {
    $response = $this->request("PATCH", "invoices/recipient/refund/" . $paymentId);
    return $this->extractInvoiceFromRefund($response);
  }

  private function extractInvoiceFromRefund(array $refund): array
  {
    if (empty($refund['invoice'])) {
      throw new \RuntimeException('[FBCheckout] Resposta sem dados da invoice');
    }

    return $this->normalizeInvoiceStatus($refund['invoice']);
  }

  private function normalizeInvoiceStatus(array $invoice): array
  {
    $rawStatus = $invoice['status'] ?? null;

    $invoice['real_status'] = $rawStatus;
    $invoice['status']      = $this->mapInvoiceStatus($rawStatus);

    return $invoice;
  }

  public function refundDebitPayment($paymentId, $amount = null)
  {
    // Implementação de estorno de pagamento a débito
  }

  public function findPayment($paymentId)
  {
    // Implementação de busca de pagamento
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

  public function insertCustomer($email, array $options = [])
  {
    // Implementação de inserção de cliente
  }

  public function insertCard($customerId, $data, $token = null)
  {
    $payload = [
      "creditCard" => [
        "cardNumber" => str_replace(' ', '', $data['cardNumber']),
        "holderName" => $this->removeAccents($data['cardholderName']),
        "expirationMonth" => (string) $data['expirationMonth'],
        "expirationYear" => (string) $data['expirationYear'],
        "securityCode" => $data['cvv'],
        "brand" => $this->identifyBrand($data['cardNumber']),
      ],
      "client" => [
        "name" => $this->removeAccents($data['cardholderName']),
        "document" => $this->removeAccents($data['docNumber']),
      ]
    ];

    $response = $this->request("POST", "credit-cards/recipient/tokenize", $payload);

    return [
      'card_id' => $response['token'],
      'brand' => $response['brand'],
      'last_four' => $response['lastFourDigits'],
      'raw' => $response,
    ];
  }


  public function searchPayment(array $params)
  {
    // Implementação de pesquisa de pagamento
  }

  public function splitPayment($paymentId)
  {
    // Implementação de divisão de pagamento
  }

  public function hasSplit(): bool
  {
    // Implementação de verificação de split
    return true; // true ou false, dependendo da lógica
  }

  private function normalizeFullName(string $name): string
  {
    $name = trim(preg_replace('/\s+/', ' ', $name));

    $parts = explode(' ', $name);

    // Já tem nome + sobrenome
    if (count($parts) >= 2) {
      return $name;
    }

    // Apenas um nome → cria sobrenome técnico
    $firstLetter = mb_strtoupper(mb_substr($name, 0, 1));

    return $name . ' ' . $firstLetter . '.';
  }

  private function mapInvoiceStatus(string $acquirerStatus): int
  {
    $map = [
      'paid'               => TransactionConst::COMPLETED,
      'approved'           => TransactionConst::COMPLETED,

      'refunded'           => TransactionConst::REFUNDED,
      'canceled'           => TransactionConst::REJECTED,
      'failed'             => TransactionConst::REJECTED,
      'expired'            => TransactionConst::REJECTED,
      'rejected'           => TransactionConst::REJECTED,

      'pending'            => TransactionConst::PENDENTE,
      'pending_generation' => TransactionConst::PENDENTE,
      'in_dispute'         => TransactionConst::PENDENTE,
      'pending_refund'     => TransactionConst::PENDENTE,
    ];

    return $map[$acquirerStatus] ?? TransactionConst::PENDENTE;
  }

  private function removeAccents($string)
  {
    return preg_replace(
      '/[^A-Za-z0-9 ]/',
      '',
      iconv('UTF-8', 'ASCII//TRANSLIT', $string)
    );
  }

  /**
   * @param $cardNumber
   * @return string
   * @throws CheckoutServiceException
   */
  private function identifyBrand($cardNumber)
  {
    switch ($cardNumber) {
      case (bool)preg_match('/^(5067|4576|4011)/', $cardNumber):
        return 'elo';

      case (bool)preg_match('/^(4)/', $cardNumber):
        return 'visa';

      case (bool)preg_match('/^(50)/', $cardNumber):
        return 'aura';

      case (bool)preg_match('/^(5)/', $cardNumber):
        return 'mastercard';

      case (bool)preg_match('/^(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)/', $cardNumber):
        return 'mastercard';

      case (bool)preg_match('/^(636368|438935|504175|451416|636297)/', $cardNumber):
        return 'elo';

      case (bool)preg_match('/^(606282)/', $cardNumber):
        return 'hipercard';

      case (bool)preg_match('/^(6011)/', $cardNumber):
        return 'discover';

      case (bool)preg_match('/^(60)/', $cardNumber):
        return 'hipercard';

      case (bool)preg_match('/^(3841)/', $cardNumber):
        return 'hipercard';

      case (bool)preg_match('/^(622)/', $cardNumber):
        return 'discover';

      case (bool)preg_match('/^(301|305)/', $cardNumber):
        return 'diners';

      case (bool)preg_match('/^(34|37)/', $cardNumber):
        return 'amex';

      case (bool)preg_match('/^(36|38)/', $cardNumber):
        return 'diners';

      case (bool)preg_match('/^(64|65)/', $cardNumber):
        return 'discover';

      case (bool)preg_match('/^(35)/', $cardNumber):
        return 'jcb';

      default:
        throw new CheckoutServiceException(152, compact('cardNumber'));
    }
  }

  private function assertCardPayload(): void
  {
    if (empty($this->card) || !is_array($this->card)) {
      throw new CheckoutServiceException(153, ['card' => $this->card]);
    }

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

  private function request(string $method, string $url, $payload = null)
  {
    $response = $this->httpRequest($method, $url, $payload);

    return $this->handleErrors($response);
  }

  private function handleErrors(array $response): array
  {
    if (!empty($response['curlError'])) {
      throw new \RuntimeException("[FBCheckout] Transport error: {$response['curlError']}");
    }

    $httpCode = $response['httpCode'] ?? 0;
    $body     = $response['body'] ?? [];

    $errorMsg = (is_array($body) ? ($body['message'] ?? $body['error'] ?? null) : null)
      ?? $response['raw']
      ?? 'Unknown error';

    if ($httpCode < 200 || $httpCode >= 300) {
      $errorMsgJson = is_string($errorMsg) ? $errorMsg : json_encode($errorMsg);
      throw new \RuntimeException("[FBCheckout] HTTP {$httpCode}: {$errorMsgJson}");
    }

    if (empty($body) || !is_array($body)) {
      throw new \RuntimeException("[FBCheckout] Invalid or empty response body");
    }

    return $body;
  }

  private function httpRequest(
    string $method,
    string $url,
    $data = null
  ) {
    $ch = curl_init();

    $headers = [
      'Content-Type: application/json',
      'Accept: application/json',
      'x-api-key: ' . $this->api_key,
      'x-api-secret: ' . $this->api_secret,
    ];

    $sessionId = UUID::v4();
    $headers[] = 'x-session-id: ' . $sessionId;

    curl_setopt_array($ch, [
      CURLOPT_URL => $this->baseURL . $url,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_CUSTOMREQUEST => strtoupper($method),
      CURLOPT_HTTPHEADER => $headers,
      CURLOPT_TIMEOUT => 30,
    ]);

    if (!empty($data)) {
      curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }

    // $curlCommand = "curl -X " . strtoupper($method) . " '" . $this->baseURL . $url . "'";

    // foreach ($headers as $header) {
    //   $curlCommand .= " \\\n  -H '" . $header . "'";
    // }

    // if (!empty($data)) {
    //   $curlCommand .= " \\\n  -d '" . json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "'";
    // }

    // dd($curlCommand);

    $responseBody = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);

    curl_close($ch);

    return [
      'success' => $curlError === '' && $httpCode >= 200 && $httpCode < 300,
      'httpCode' => $httpCode,
      'body' => json_decode($responseBody, true),
      'raw' => $responseBody,
      'curlError' => $curlError ?: null,
    ];
  }
}
