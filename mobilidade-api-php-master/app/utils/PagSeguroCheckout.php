<?php

namespace app\utils;

use app\constant\FinancialIntermediaryConst;
use app\contracts\CheckoutInterface;
use app\exceptions\CheckoutServiceException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/12/2019
 * Time: 19:47
 */
class PagSeguroCheckout implements CheckoutInterface
{
    private $financialIntermediaryId = FinancialIntermediaryConst::PAGSEGURO;
    /**
     * @var string
     */
    private $api_token;
    /**
     * @var string
     */
    private $account_email;
    /**
     * @var string
     */
    private $api_url;

    /**
     * Parametros alimentados pelo setParameters()
     */
    private $sale_id;
    private $value;
    private $description;
    private $email;

    private $card;

    public function __construct(string $api_token, string $account_email)
    {
        $this->api_token = $api_token;
        $this->account_email = $account_email;
        $this->api_url = !(env('ENV') == 'production') ?
            "https://ws.sandbox.pagseguro.uol.com.br/v2/" :
            "https://ws.pagseguro.uol.com.br/v2/";
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
        $sessionId = $this->generateSession();

        $cardToken = $this->generateCardToken($sessionId);

        $result = $this->curlXmlExec(
            "transactions",
            'POST',
            [
                'paymentMode' => 'default',
                'paymentMethod' => 'creditCard',
                'receiverEmail' => $this->account_email,
                'currency' => 'BRL',
                'extraAmount' => "1.00",
                'itemId1' => $this->sale_id,
                'itemDescription1' => str_replace(' ', '', $this->description),
                'itemAmount1' => "$this->value",
                'itemQuantity1' => 1,
                'notificationURL' => 'http://localhost:8081/Test/Pagseguro',
                'reference' => $this->sale_id,
                'senderName' => 'Eduardo Roseo',
                'senderCPF' => '06794961300',
                'senderAreaCode' => '85',
                'senderPhone' => '988179596',
                'senderEmail' => 'eduardoroseo@gmail.com',
                'senderIp' => $this->getSenderIp(),
                'shippingAddressStreet' => 'RuaJoseCavalcanteSobrinho',
                'shippingAddressNumber' => '120',
                'shippingAddressComplement' => 'BL03AP502',
                'shippingAddressDistrict' => 'Coaçu',
                'shippingAddressPostalCode' => '60871640',
                'shippingAddressCity' => 'Fortaleza',
                'shippingAddressState' => 'CE',
                'creditCardToken' => $cardToken,
                'installmentValue' => $this->value,
                'installmentQuantity' => 1,
                'shippingAddressCountry' => 'BRA',
                'creditCardHolderName' => $this->card['cardholderName'],
                'creditCardHolderCPF' => $this->card['holderDocument'],
                'billingAddressStreet' => 'RuaJoseCavalcanteSobrinho',
                'billingAddressNumber' => '120',
                'billingAddressComplement' => 'BL03AP502',
                'billingAddressDistrict' => 'Coaçu',
                'billingAddressPostalCode' => '60871640',
                'billingAddressCity' => 'Fortaleza',
                'billingAddressState' => 'CE',
                'billingAddressCountry' => 'BRA',
            ],
            [
                'email' => $this->account_email,
                'token' => $this->api_token,
            ]);

        dd($result);

        // TODO: Implement doPayment() method.

        return [];
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
        // TODO: Implement refundPayment() method.
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
        // TODO: Implement findPayment() method.
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
    private function generateSession()
    {
        $result = $this->curlXmlExec(
            'sessions',
            'POST',
            [],
            [
                'email' => $this->account_email,
                'token' => $this->api_token,
            ]);

        if (!isset($result['id']))
            throw new CheckoutServiceException(150, $result);

        return $result['id'];
    }

    /**
     * @param $sessionId
     * @return SimpleXMLElement
     * @throws CheckoutServiceException
     */
    private function generateCardToken($sessionId)
    {
        $cardBrand = $this->findCardBrand($sessionId);

        $result = $this->curlXmlExec(
            'https://df.uol.com.br/v2/cards',
            'POST',
            [
                'sessionId' => $sessionId,
                'amount' => $this->value,
                'cardNumber' => $this->card['number'],
                'cardBrand' => $cardBrand,
                'cardCvv' => $this->card['cvv'],
                'cardExpirationMonth' => $this->card['expirationMonth'],
                'cardExpirationYear' => $this->card['expirationYear'],
            ]);

        if (!isset($result['token']))
            throw new CheckoutServiceException(150, $result);

        return $result['token'];
    }

    /**
     * @param $sessionId
     * @return mixed
     * @throws CheckoutServiceException
     */
    private function findCardBrand($sessionId)
    {
        $bin = substr($this->card['number'], 0, 6);

        $brand = $this->curlJsonExec(
            "https://df.uol.com.br/df-fe/mvc/creditcard/v1/getBin",
            'GET',
            null,
            [
                'tk' => $sessionId,
                'creditCard' => $bin,
            ]);

        if (!isset($brand['bin']->brand->name))
            throw new CheckoutServiceException(150, $brand);

        return $brand['bin']->brand->name;
    }

    private function curlJsonExec($url, $method, $data = null, array $url_params = [])
    {
        if ($url_params) {
            $url .= "?";
            foreach ($url_params as $key => $param) {
                $url .= "{$key}={$param}";
                if (end($url_params) != $param)
                    $url .= "&";
            }
        }

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt(
            $ch, CURLOPT_URL, $url);

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

    private function curlXmlExec($actionUri, $method, array $data = [], array $url_params = [])
    {
        $url = filter_var($actionUri, FILTER_VALIDATE_URL) ?
            $actionUri :
            $this->api_url . $actionUri;

        if ($url_params) {
            $url .= "?";
            foreach ($url_params as $key => $param) {
                $url .= "{$key}={$param}&";
            }

            $url = substr($url, 0, -1);
        }

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_URL, $url);

        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);

        if ($data) {
            $postFields = '';

            foreach ($data as $key => $param) {
                $postFields .= "{$key}={$param}";
                if (end($data) != $param)
                    $postFields .= "&";
            }

            curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                "Content-Type: application/x-www-form-urlencoded",
            ));
        }

        $response = simplexml_load_string(curl_exec($ch));

        curl_close($ch);

        return $response ? get_object_vars($response) : $response;
    }

    private function getSenderIp()
    {
        $ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'];

        return $ip == '::1' ? '127.0.0.1' : $ip;
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