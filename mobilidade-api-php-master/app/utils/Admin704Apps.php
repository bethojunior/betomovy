<?php

namespace app\utils;

use app\exceptions\Admin704AppsException;

class Admin704Apps
{
  private string $apiUrl;
  private string $secret;
  private string $id;
  private string $appName;
  private string $customerName;

  public function __construct()
  {
    $this->appName      = env('APP_NAME') ?: 'default';
    $this->apiUrl       = env('ADMIN704APPS_API_URL') ?: '';
    $this->id           = env('ADMIN704APPS_API_ID') ?: '' ;
    $this->secret       = env('ADMIN704APPS_API_SECRET') ?: '';
    $this->customerName = env('ADMIN704APPS_CUSTOMER_NAME') ?? $this->appName;

    if (!$this->apiUrl || !$this->secret || !$this->id) {
      throw new Admin704AppsException('Admin704Apps environment variables not configured.');
    }
  }

  public function getCustomerAcquirer($paymentType = 'card'): array
  {
    return $this->request(
      '/customers/acquirer?name=' . $this->customerName . '&payment_type=' . $paymentType,
      'GET'
    );
  }
  
  public function updateTransactionStatus(string $externarId, string $status): array
  {
    return $this->request(
      '/global-transactions/external/' . $externarId . "/status/" . $status,
      'PATCH'
    );
  }

  public function storeTransaction(array $payload): array
  {
    $required = [
      'customer_id',
      'acquirer_id',
      'amount',
      'status',
      'payment_method',
      'external_id'
    ];

    foreach ($required as $field) {
      if (!array_key_exists($field, $payload)) {
        throw new Admin704AppsException("Missing required field: {$field}");
      }
    }

    return $this->request('/global-transactions', 'POST', $payload);
  }

  public function request(string $endpoint, string $method = 'GET', array $data = []): array
  {
    $url = rtrim($this->apiUrl, '/') . '/' . ltrim($endpoint, '/');

    $headers = [
      'Accept: application/json',
      'Content-Type: application/json',
      'secret: ' . $this->secret,
      'id: ' . $this->id,
    ];

    $ch = curl_init();

    curl_setopt_array($ch, [
      CURLOPT_URL => $url,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_TIMEOUT => 30,
      CURLOPT_CUSTOMREQUEST => strtoupper($method),
      CURLOPT_HTTPHEADER => $headers,
    ]);

    if (!empty($data)) {
      curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }

    $response = curl_exec($ch);

    if ($response === false) {
      $error = curl_error($ch);
      curl_close($ch);
      throw new Admin704AppsException("cURL error: {$error}");
    }

    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $decoded = json_decode($response, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
      throw new Admin704AppsException('Invalid JSON response from API');
    }

    if ($httpCode >= 400) {
      throw new Admin704AppsException(
        $decoded['message'] ?? 'API error',
        $httpCode
      );
    }

    if (isset($decoded['status']) && $decoded['status'] === false) {
      throw new Admin704AppsException(
        $decoded['message'] ?? 'Request failed'
      );
    }

    return $decoded['response'] ?? $decoded;
  }
}