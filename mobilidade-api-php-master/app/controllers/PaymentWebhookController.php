<?php

namespace app\controllers;

use app\services\payment\webhook\PaymentWebhookService;
use app\services\payment\webhook\PaymentWebhookStatusConst;
use app\utils\Logger;

class PaymentWebhookController extends ApiController
{
    private PaymentWebhookService $service;

    public function __construct()
    {
        $this->service = new PaymentWebhookService();
    }

    public function actionConfirm704paypayment()
    {
        $statusReceived = $this->request(false)->status_payment;

        if (empty($statusReceived) || $statusReceived->name !== PaymentWebhookStatusConst::SUCCESS) {
            throw new \Exception('Não há ação configurada para o status recebido');
        }

        try {
            $response = $this->service->processPayment($this->request(false));
            if ($response['status'] !== 200) {
                $this->returnError([], $response['message'], $response['status']);
            }

            echo $this->returnSuccess($response['message'], $response['data']);
        } catch (\Exception $e) {
            echo $this->returnError($e, $e->getMessage(), 400);
        }
    }

    public function actionIpagWebHook()
    {
        try {
            $this->service->proccessPaymentIpag($this->request(false));
        } catch (\Exception $e) {
            return $this->returnError($e, $e->getMessage(), 400);
        }
    }

    public function actionFBWebhook()
    {
        try {
            $response = $this->service->proccessPaymentFB($this->request(false));
            echo $this->returnSuccess($response['message'], $response['data']);
        } catch (\Exception $e) {
            echo $this->returnError($e, $e->getMessage(), 400);
        }
    }

    public function actionMpWebhook()
    {
        try {
            $response = $this->service->proccessPaymentMP($this->request(false));
            echo $this->returnSuccess($response['message'], $response['data'] ?? []);
        } catch (\Exception $e) {
            echo $this->returnError($e, $e->getMessage(), 400);
        }
    }

    public function actionYumepayWebhook()
    {
        try {
            $this->service->proccessPaymentYume($this->request(false));
        } catch (\Exception $e) {
            return $this->returnError($e, $e->getMessage(), 400);
        }
    }

    public function actionStripeWebhook()
    {
        try {
            $payload = file_get_contents('php://input');
            $sigHeader = $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '';

            $webhookSecret = \app\model\AcquirerMetaData::get('webhook_secret')
                ?: \app\model\AcquirerMetaData::get('stripe_webhook_secret')
                ?: (getenv('STRIPE_WEBHOOK_SECRET') ?: '');

            if (!empty($webhookSecret) && !empty($sigHeader)) {
                if (!$this->verifyStripeSignature($payload, $sigHeader, $webhookSecret)) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Invalid Stripe signature']);
                    return;
                }
            }

            $event = json_decode($payload, true);
            if (!$event || !isset($event['type'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid event payload']);
                return;
            }

            $result = $this->service->processPaymentStripe($event);
            http_response_code(200);
            echo json_encode(['received' => true, 'result' => $result]);
        } catch (\Throwable $e) {
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    private function verifyStripeSignature(string $payload, string $sigHeader, string $secret): bool
    {
        $timestamp = null;
        $signatures = [];
        foreach (explode(',', $sigHeader) as $part) {
            [$k, $v] = array_pad(explode('=', trim($part), 2), 2, null);
            if ($k === 't') {
                $timestamp = $v;
            }
            if ($k === 'v1' && $v) {
                $signatures[] = $v;
            }
        }
        if (!$timestamp || empty($signatures)) {
            return false;
        }
        if (abs(time() - (int)$timestamp) > 300) {
            return false;
        }
        $signedPayload = $timestamp . '.' . $payload;
        $expected = hash_hmac('sha256', $signedPayload, $secret);
        foreach ($signatures as $sig) {
            if (hash_equals($expected, $sig)) {
                return true;
            }
        }
        return false;
    }
}