<?php

namespace app\utils;

use app\constant\FinancialIntermediaryConst;
use app\contracts\CheckoutInterface;
use app\dao\UserDao;
use app\exceptions\CheckoutServiceException;
use CotaBank;
use stdClass;

require_once dirname(__FILE__) . "/cotabank/CotaBank.php";

class CotabankCheckout implements CheckoutInterface
{
    private $financialIntermediaryId = FinancialIntermediaryConst::COTABANK;
    private $cotabank;

    private $value;
    private $description;
    private $userId;
    private $name;
    private $email;
    private $phone;
    private $card;
    private $user;
    private $terminal_code;
    private $document;
    protected static $path = null;


    public function __construct(string $user, string $password, $terminal_code)
    {
        $this->terminal_code = $terminal_code;
        $environment = (env('ENV') == 'test') ? 'homologation' : 'production';
        $this->cotabank = new CotaBank($user, $password, $environment);
    }

    public function __get($name)
    {
        if (isset($name)) {
            return $this->$name ?? null;
        }
    }

    public function creditPayment()
    {
        $user = (new UserDao)->find($this->userId, ['email', 'document', 'phone', 'idUser']);
        $dataTransaction = array(
            "pan" => $this->card['number'],
            "cardholderName" => strtoupper($this->card['cardholderName']),
            "expirationDate" => $this->card['expirationMonth'] . '/' . substr($this->card['expirationYear'], 2),
            "cvvStatus" => "E",
            "cvv" => $this->card['cvv'],
            "brand" => strtoupper(CardUtil::getFlag($this->card['number'])),
            "amount" => $this->value,
            "date" => date('Y-m-d\TH:i:s'),
            "paymentType" => "V",
            "installments" => 1,
            "site" => $this->terminal_code,
            "splitMode" => false,
            "sellerChannel" => "web",
            "productsCategory" => "Outras Categorias Não Especificada",
            "customer" => array(
                "gender" => $this->user->gender == 'masculino' ? 'M' : 'F',
                "login" => $this->user->email,
                "name" => $this->user->name,
                "ddd" => "61",
                "phone" => "985680000",
                "email" => $this->user->email,
                "documentType" => "CPF",
                "document" => FormatValue::formatDocumentClear($this->document),
                "birthDate" => "01/06/1991",
                "ip" => '177.69.0.82',
                "fingerPrint" => rand(1, 109099),
                "billing" => array(
                    "street" => "SSCLRN",
                    "number" => "703",
                    "neighborhood" => "Asa Norte,",
                    "city" => "Brasilia",
                    "state" => "DF",
                    "country" => "Brasil",
                    "zipcode" => "70830511"
                ),
                "shipping" => null
            ),
            "products" => array(array(
                "name" => $this->description,
                "price" => $this->value,
                "quantity" => 1,
                "sku" => "1"
            ))
        );
        $transaction = (array)$this->cotabank->getCharge()->creditCard($dataTransaction);

        $transaction['value'] = $this->value;
        $this->validateArrayResponse($transaction);
        return $transaction;
    }

    public function debitPayment()
    {
        $cardToken = $this->generateCardToken();
        $name = $this->mountArrayName();
        $first_name = array_shift($name);
        $last_name = implode(" ", $name);
        $user = (new UserDao)->find($this->userId, ['email', 'document', 'phone']);

        $data = [
            'seller_id' => $this->seller_id,
            'amount' => (int)round(round((float)$this->value, 2) * 100),
            'order' => [
                'order_id' => $this->sale_id
            ],
            'customer' => [
                'customer_id' => $this->userId,
                'first_name' => $first_name,
                'last_name' => $last_name ?? null,
                'email' => $user->email,
                'document_type' => 'CPF',
                'document_number' => FormatValue::formatDocumentClear($user->document),
                'phone_number' => FormatValue::formatPhoneClear($user->phone),
                'billing_address' => new stdClass()
            ],
            'device' => new stdClass(),
            'debit' => [
                'authenticated' => false,
                'card' => [
                    'number_token' => $cardToken,
                    'cardholder_name' => $this->card['cardholderName'],
                    'expiration_month' => $this->card['expirationMonth'],
                    'expiration_year' =>
                        substr($this->card['expirationYear'], -2, 2)
                ]
            ]
        ];

        $sale = $this->curlExec('v1/payments/debit', 'POST', $data);
        $this->validateArrayResponse($sale);
        return $sale;
    }

    public function refundCreditPayment($paymentId, $amount = null)
    {
        return (array)$this->cotabank->getReversal()->reversal($paymentId);
    }

    public function refundDebitPayment($paymentId, $amount = null)
    {
        return $this
            ->curlCancel("v1/payments/debit/{$paymentId}/cancel");
    }

    public function findPayment($paymentId)
    {
    }

    public function setParameters(array $data): CheckoutInterface
    {
        foreach ($data as $key => $value) {
            if (property_exists($this, $key))
                $this->$key = $value;
        }
        return $this;
    }

    public function insertCustomer($email, array $options = [])
    {
    }

    public function insertCard($customerId, $data, $token = null)
    {
    }

    public function searchPayment(array $params)
    {
    }

    private function oAuth()
    {
        $authorization = base64_encode("{$this->client_id}:{$this->client_secret}");
        return $this->curlAuth($authorization);
    }

    private function generateCardToken()
    {
        $data = [
            'card_number' => $this->card['number']
        ];
        $number_token = $this->curlExec('v1/tokens/card', 'POST', $data, true);

        return $number_token['number_token'];
    }

    private function mountArrayName()
    {
        return explode(' ', $this->name);
    }

    private function validateArrayResponse(?array $payment)
    {

        if ($payment['status'] != '1') {
            throw new CheckoutServiceException(150, compact('payment'));
        }
    }

    private function curlExec($actionUri, $method, $data = null, $gzDecode = false)
    {
        $tokenAuth = $this->oAuth();

        if (!isset($tokenAuth['access_token']))
            throw new CheckoutServiceException(150, compact('tokenAuth'));

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_URL, $this->api_url . $actionUri);

        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);

        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                "Authorization: Bearer " . $tokenAuth['access_token'],
                "Accept: application/json, text/plain, */*",
                "Content-Type: application/json",
            ));
        }

        $response = curl_exec($ch);
        $validation = json_decode($response);

        if (isset($validation->status_code) && $validation->status_code == 401)
            throw new CheckoutServiceException(150, compact('validation'));

        $gzDecoded = $gzDecode || !json_decode($response) ? gzdecode($response) : $response;
        $response = json_decode($gzDecoded ?? $response);
        curl_close($ch);

        return $response ? get_object_vars($response) : $response;
    }

    private function curlCancel($actionUri)
    {
        $tokenAuth = $this->oAuth();

        if (!isset($tokenAuth['access_token']))
            throw new CheckoutServiceException(150, compact('tokenAuth'));

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_URL, $this->api_url . $actionUri);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            "Authorization: Bearer " . $tokenAuth['access_token'],
            "Accept: */*",
            "Content-Length: 0",
            'content-type: application/json; charset=utf-8',
            "Accept-Encoding: gzip, deflate, br"
        ));
        curl_setopt($ch, CURLOPT_POST, true);

        $response = curl_exec($ch);
        $gzDecoded = gzdecode($response);
        $response = json_decode($gzDecoded ?? $response);

        if (json_last_error() != JSON_ERROR_NONE)
            throw new CheckoutServiceException(150, [
                'message' => json_last_error_msg(),
                'gzDecoded' => $gzDecoded
            ]);

        curl_close($ch);

        return $response ? get_object_vars($response) : $response;
    }

    private function curlAuth($client_encoded)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_URL, $this->api_url . 'auth/oauth/v2/token');
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
        curl_setopt($ch, CURLOPT_POSTFIELDS, 'scope=oob&grant_type=client_credentials');
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            "Content-Type: application/x-www-form-urlencoded",
            "Accept: application/json, text/plain, */*",
            "Authorization: Basic {$client_encoded}",
        ));

        $response = json_decode(curl_exec($ch));
        curl_close($ch);

        return $response ? get_object_vars($response) : $response;
    }

    private function captureDeviceFingerprint($sessionId)
    {
        $environment = !(env('ENV') == 'production') ?
            '1snn5n9w' :
            'k8vif92e';

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_URL, 'https://h.online-metrix.net/fp/tags.js?org_id=' . $environment . '&session_id=' . $sessionId);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            "Content-Type: application/x-www-form-urlencoded",
            "Accept: application/json, text/plain, */*",
        ));

        $response = json_decode(curl_exec($ch));

        curl_close($ch);

        return $response ? get_object_vars($response) : $response;
    }

    static function path()
    {
        if (self::$path === null)
            self::$path = CotabankCheckout . phpdirname(__FILE__);
        return self::$path;
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