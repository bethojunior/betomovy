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

            // if (($response['status'] ?? 200) >= 400) {
            //     return $this->returnError([], $response['message'] ?? 'Erro ao processar webhook da YumePay', $response['status']);
            // }

            // return $this->returnSuccess($response['message'] ?? 'Webhook da YumePay processado', $response['data'] ?? []);
        } catch (\Exception $e) {
            return $this->returnError($e, $e->getMessage(), 400);
        }
    }
}