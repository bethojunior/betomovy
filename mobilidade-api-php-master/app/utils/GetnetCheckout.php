<?php

namespace app\utils;

use app\constant\FinancialIntermediaryConst;
use app\contracts\CheckoutInterface;
use app\dao\OriginDao;
use app\dao\TripDao;
use app\dao\UserDao;
use app\exceptions\CheckoutServiceException;
use app\model\Geocoder;
use stdClass;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/12/2019
 * Time: 19:18
 */
class GetnetCheckout implements CheckoutInterface
{
    private $financialIntermediaryId = FinancialIntermediaryConst::GETNET;

    /**
     * @var null|string
     */
    private $seller_id;
    /**
     * @var string
     */
    private $client_id;
    /**
     * @var string
     */
    private $client_secret;
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
    private $userId;
    private $name;
    private $email;
    private $phone;
    private $card;

    public function __construct(?string $seller_id, string $client_id, string $client_secret)
    {
        $this->seller_id = $seller_id;
        $this->client_id = $client_id;
        $this->client_secret = $client_secret;
        $this->api_url = !(env('ENV') == 'production') ?
            "https://api-sandbox.getnet.com.br/" :
            "https://api.getnet.com.br/";
    }

    public function __get($name)
    {
        // TODO: Implement __get() method.
        return $this->$name ?? null;
    }

    /**
     * @return array|mixed
     * @throws CheckoutServiceException
     */
    public function creditPayment()
    {
        $cardToken = $this->generateCardToken();

        $name = $this->mountArrayName();
        $first_name = array_shift($name);
        $last_name = implode(" ", $name);
        $sessionId = md5($this->card['holderDocument'] . now());

        try {
            if (isset($this->sale_id)) {
                $origin = (new OriginDao())->find((new TripDao())->find($this->sale_id)->originId);

                $address = (new GeocodingService)->search("{$origin->latitude},{$origin->longitude}", true);
            } else {
                $user = (new UserDao())->findWithLocation($this->userId);

                $address = (new GeocodingService)->search("{$user->last_lat},{$user->last_lon}", true);
            }
        } catch (\Exception $e) {
            $address = null;
        }

        $data = (object)[
            'seller_id' => $this->seller_id,
            'amount' => (int)round(round((float)$this->value, 2) * 100),
            'order' => (object)[
                'order_id' => $this->sale_id ?? UUID::v4()
            ],
            'customer' => (object)[
                'customer_id' => $this->userId,
                'first_name' => $first_name,
                'last_name' => $last_name ?? null,
                'email' => $this->email,
                'document_type' => 'CPF',
                'document_number' => FormatValue::formatDocumentClear($this->card['holderDocument']),
                'phone_number' => '55' . FormatValue::formatPhoneClear($this->phone),
                'billing_address' => (object)[
                    'street' => $address->getStreet() ?? '',
                    'number' => $address->getNumber() ?? '',
                    'complement' => '',
                    'city' => $address->getCity() ?? '',
                    'state' => $address->getEstate() ?? '',
                    'country' => $address->getCountry() ?? '',
                    'postal_code' => FormatValue::onlySimpleCharacters($address->getPostalCode()) ?? '',
                ]
            ],
            'device' => (object)[
                'ip_address' => $_SERVER["REMOTE_ADDR"] ?? null,
                'device_id' => $sessionId,
            ],
            'credit' => (object)[
                'delayed' => false,
                'save_card_data' => false,
                'transaction_type' => 'FULL',
                'number_installments' => 1,
                'card' => (object)[
                    'number_token' => $cardToken,
                    'cardholder_name' => strtoupper($this->card['cardholderName']),
                    'expiration_month' => $this->card['expirationMonth'],
                    'expiration_year' => substr($this->card['expirationYear'], -2, 2),
                    'security_code' => $this->card['cvv'],
                    'brand' => CardUtil::getFlag($this->card['number']),
                ]
            ]
        ];

        /** @var Geocoder|null $address */
        if ($address instanceof Geocoder && $address->getAddress()) {
            $data = array_merge((array) $data, [
                'shippings' => [
                    [
                        'phone_number' => '55' . FormatValue::formatPhoneClear($this->phone),
                        'address' => (object)[
                            'street' => $address->getStreet() ?? '',
                            'number' => $address->getNumber() ?? '',
                            'complement' => '',
                            'city' => $address->getCity() ?? '',
                            'state' => $address->getEstate() ?? '',
                            'country' => $address->getCountry() ?? '',
                            'postal_code' => FormatValue::onlySimpleCharacters($address->getPostalCode()) ?? '',
                        ]
                    ]
                ],
            ]);
        }

        $sale = $this->curlExec('v1/payments/credit', 'POST', $data);

        $this->validateArrayResponse($sale);

        return $sale;
    }

    /**
     * @return array|mixed
     * @throws CheckoutServiceException
     */
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

    /**
     * @param $paymentId
     * @param null $amount
     * @return array|mixed
     * @throws CheckoutServiceException
     */
    public function refundCreditPayment($paymentId, $amount = null)
    {
        return $this
            ->curlCancel("v1/payments/credit/{$paymentId}/cancel");
    }

    /**
     * @param $paymentId
     * @param null $amount
     * @return array|mixed
     * @throws CheckoutServiceException
     */
    public function refundDebitPayment($paymentId, $amount = null)
    {
        return $this
            ->curlCancel("v1/payments/debit/{$paymentId}/cancel");
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

    private function oAuth()
    {
        $authorization = base64_encode("{$this->client_id}:{$this->client_secret}");

        return $this->curlAuth($authorization);
    }

    /**
     * @return mixed
     * @throws CheckoutServiceException
     */
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

    /**
     * @param array $payment
     * @throws CheckoutServiceException
     */
    private function validateArrayResponse(?array $payment)
    {
        if (!isset($payment['payment_id']) && !isset($payment['status_code']))
            throw new CheckoutServiceException(150, compact('payment'));

        if (isset($payment['status_code']) && $payment['status_code'] == 400)
            throw new CheckoutServiceException(150, compact('payment'));
    }

    /**
     * @param $actionUri
     * @param $method
     * @param null $data
     * @param bool $gzDecode
     * @return array|mixed
     * @throws CheckoutServiceException
     */
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

    /**
     * @param $actionUri
     * @return array|mixed
     * @throws CheckoutServiceException
     */
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