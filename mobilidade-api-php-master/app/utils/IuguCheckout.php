<?php

namespace app\utils;

use app\constant\FinancialIntermediaryConst;
use app\contracts\CheckoutInterface;
use app\exceptions\CheckoutServiceException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/11/2019
 * Time: 14:29
 */
class IuguCheckout implements CheckoutInterface
{
    private $financialIntermediaryId = FinancialIntermediaryConst::IUGU;
    /**
     * @var string
     */
    private $api_token;
    /**
     * @var string
     */
    private $account_id;
    /**
     * @var bool
     */
    private $test;

    private $base_url = "https://api.iugu.com/v1/";

    /**
     * Parametros alimentados pelo setParameters()
     */
    private $sale_id;
    private $value;
    private $description;
    private $email;

    private $card;

    public function __construct(string $api_token, string $account_id)
    {
        $this->api_token = $api_token;
        $this->account_id = $account_id;
        $this->test = !(env('ENV') == 'production');
    }

    public function __get($name)
    {
        // TODO: Implement __get() method.
        return $this->$name ?? null;
    }

    /**
     * @return array
     * @throws CheckoutServiceException
     */
    public function creditPayment()
    {
        $paymentToken = $this->generateToken();

        $result = $this->curlExec(
            'charge',
            'POST',
            [
                'token' => $paymentToken,
                'email' => $this->email ?? '',
                'items' => [
                    [
                        'description' => $this->description,
                        'quantity' => 1,
                        'price_cents' => round((float)$this->value, 2) * 100
                    ]
                ],
                'order_id' => $this->sale_id,
            ]);

        if (!isset($result['invoice_id']))
            throw new CheckoutServiceException(150, $result);

        $invoice_id = $result['invoice_id'];
        $lr = $result['LR'] ?? null;

        $result = $this->capture($invoice_id);

        if (!isset($result['id']))
            $result = $this->findPayment($invoice_id);

        $result['status_detailed'] = $lr;

        return $result;
    }

    /**
     * @throws CheckoutServiceException
     */
    public function debitPayment()
    {
        throw new CheckoutServiceException(154);
    }

    public function refundCreditPayment($paymentId, $amount = null)
    {
        $result = $this->curlExec("invoices/{$paymentId}/refund", 'POST');

        return $result;
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

    public function findPayment($paymentId)
    {
        $result = $this->curlExec("invoices/{$paymentId}", 'GET');

        return $result;
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

    public function insertCustomer($email, array $options = [])
    {
        // TODO: Implement insertCustomer() method.
    }

    public function insertCard($customerId, $data, $token = null)
    {
        // TODO: Implement insertCard() method.
    }

    public function searchPayment(array $params)
    {
        // TODO: Implement searchPayment() method.
    }

    /**
     * @return mixed
     * @throws CheckoutServiceException
     */
    private function generateToken()
    {
        $holderName = $this->getHolderName();

        $result = $this->curlExec(
            'payment_token',
            'POST',
            [
                'account_id' => $this->account_id,
                'method' => 'credit_card',
                'data' => [
                    'number' => $this->card['number'],
                    'verification_value' => $this->card['cvv'],
                    'first_name' => $holderName['firstName'],
                    'last_name' => $holderName['lastName'],
                    'month' => $this->card['expirationMonth'],
                    'year' => $this->card['expirationYear'],
                ],
                'test' => $this->test
            ]);

        if (!isset($result['id']))
            throw new CheckoutServiceException(150, $result);

        return $result['id'];
    }

    private function capture($payment_id)
    {
        $result = $this->curlExec(
            "invoices/{$payment_id}/capture",
            'POST');

        return $result;
    }

    private function curlExec($actionUri, $method, $data = null)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt(
            $ch,
            CURLOPT_URL,
            $this->base_url . $actionUri . '?api_token=' . $this->api_token);

        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);

        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                "Content-Type: application/json",
                "Accept: application/json",
            ));
        }

        $response = json_decode(curl_exec($ch));
        curl_close($ch);

        return $response ? get_object_vars($response) : $response;
    }

    private function getHolderName()
    {
        $holderName = explode(' ', $this->card['cardholderName'], 2);

        return [
            'firstName' => $holderName[0] ?? '',
            'lastName' => $holderName[1] ?? '',
        ];
    }

    public function captureAmount($paymentId, $amount = null)
    {
        // TODO: Implement captureAmount() method.
    }

    public function reserveAmount()
    {
        // TODO: Implement reserveAmount() method.
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
        // TODO: Implement captureAmount() method.
    }
}