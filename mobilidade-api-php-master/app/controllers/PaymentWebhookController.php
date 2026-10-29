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

            $event = json_decode($payload, true);
            if (!$event || !isset($event['type'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid event payload']);
                return;
            }

            $eventType = $event['type'];
            $object = $event['data']['object'] ?? [];

            switch ($eventType) {
                case 'payment_intent.succeeded':
                    $paymentIntentId = $object['id'] ?? null;
                    $saleId = $object['metadata']['sale_id'] ?? null;
                    // Persistir status se necessário
                    break;
                case 'payment_intent.payment_failed':
                    $paymentIntentId = $object['id'] ?? null;
                    break;
            }

            http_response_code(200);
            echo json_encode(['received' => true]);
        } catch (\Throwable $e) {
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}