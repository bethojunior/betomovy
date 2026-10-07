<?php

namespace app\utils;

use app\constant\FinancialIntermediaryConst;
use app\contracts\CheckoutInterface;
use app\dao\DriverDao;
use app\dao\OriginDao;
use app\dao\TripDao;
use app\dao\UserDao;
use app\exceptions\CheckoutServiceException;

class ZspayCheckout implements CheckoutInterface
{
    private $financialIntermediaryId = FinancialIntermediaryConst::ZSPAY;

    private $api_url;
    private $token;
    private $establishmentId;

    private $sale_id;
    private $phone;
    private $dateOfBirth;
    private $email;
    private $name;
    private $card;
    private $value;
    private $userId;

    const STATUS_APPROVED = 2;

    public function __construct(string $token, int $establishmentId)
    {
        $this->api_url = 'https://api.zsystems.com.br/';
        $this->token = $token;
        $this->establishmentId = $establishmentId;
    }


    public function __get($name)
    {
        return $this->$name ?? null;
    }

    public function creditPayment()
    {
        $typePaymentCredit = 3;
        $address = null;
        if (isset($this->sale_id)) {
            $origin = (new OriginDao())->find((new TripDao())->find($this->sale_id)->originId);
            $address = (new GeocodingService)->search("{$origin->latitude},{$origin->longitude}", true);

        } else {
            $user = (new UserDao())->find($this->userId);
            if (empty($user->last_lat) || empty($user->last_lon)) {
                $driver = (new DriverDao())->findByUserId($this->userId);
                $lastLat = $driver->latitude;
                $lastLon = $driver->longitude;
            } else {
                $lastLat = $user->last_lat;
                $lastLon = $user->last_lon;
            }
            $address = (new GeocodingService)->search("{$lastLat},{$lastLon}", true);
        }


        $data = (object)[
            "cartao" => (object)[
                "codigoSeguranca" => $this->card['cvv'],
                "numero" => $this->card['number'],
                "titular" => $this->card['cardholderName'],
                "validade" => $this->card['expirationMonth'] . '/' . $this->card['expirationYear']
            ],
            "cliente" => (object)[
                "celular" => FormatValue::formatPhoneClear($this->phone),
                "cpf" => FormatValue::formatDocumentClear($this->card['holderDocument']),
                "dataNascimento" => $this->dateOfBirth ?? null,
                "email" => $this->email,
                "nome" => $this->name
            ],
            "endereco" => (object)[
                "cep" => $address->getPostalCode() ?? null,
                "cidade" => $address->getCity() ?? null,
                "complemento" => null,
                "estado" => $this->abbreviateState($address->getEstate()) ?? null,
                "logradouro" => $address->getStreet() ?? 'S/L',
                "numero" => $address->getNumber() ?? 'S/N',
            ],
            "estabelecimentoId" => $this->establishmentId,
            "ip" => $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? null,
            "parcelas" => 1,
            "splits" => [
            ],
            "tipoPagamentoId" => $typePaymentCredit,
            "valor" => $this->value
        ];
        $sale = $this->curlExec('vendas', 'POST', $data);

        $this->validateResponse($sale);

        return $sale;
    }

    public function debitPayment()
    {
        throw new CheckoutServiceException(154);
    }

    public function refundCreditPayment($paymentId, $amount = null)
    {
        return $this->curlRefund("vendas/{$paymentId}/estornar");
    }

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
        return false;
    }

    public function searchPayment(array $params)
    {
        // TODO: Implement searchPayment() method.
    }

    private function curlExec($actionUri, $method = 'POST', $data = null)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_URL, $this->api_url . $actionUri);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 0);
        curl_setopt($ch, CURLOPT_TIMEOUT, 900);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);

        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            "Authorization: Bearer " . $this->token,
            "Accept: application/json",
            "Content-Type: application/json",
            "header: ContentType application/json"
        ));

        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }

        $response = curl_exec($ch);
        $response = json_decode($response);
        curl_close($ch);

        if (!isset($response->success) || !$response->success) {
            throw new CheckoutServiceException(150, compact('response'));
        }

        return $response ? get_object_vars($response) : $response;
    }

    private function validateResponse(?array $payment)
    {
        if (!isset($payment['success']) && !$payment['success']) {
            throw new CheckoutServiceException(150, compact('payment'));
        }

        if ($payment['pedido']->status_pedido_id == 11 || $payment['pedido']->status_pedido_id == 12) {
            throw new CheckoutServiceException(1191, compact('payment'));
        }

        if ($payment['pedido']->status_pedido_id != self::STATUS_APPROVED) {
            throw new CheckoutServiceException(150, compact('payment'));
        }
    }

    private function curlRefund($actionUri)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_URL, $this->api_url . $actionUri);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 0);
        curl_setopt($ch, CURLOPT_TIMEOUT, 900);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');

        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            "Authorization: Bearer " . $this->token,
            "Accept: application/json",
            "Content-Type: application/json",
            "header: ContentType application/json"
        ));

        $response = curl_exec($ch);
        $response = json_decode($response);
        curl_close($ch);

        if (!isset($response->success) || !$response->success) {
            throw new CheckoutServiceException(150, compact('response'));
        }

        return $response ? get_object_vars($response) : $response;
    }

    public function abbreviateState($state)
    {

        switch ($state) {
            case 'Ceará':
                $state = 'CE';
                break;
            case 'Acre':
                $state = 'AC';
                break;
            case 'Alagoas':
                $state = 'AL';
                break;
            case 'Amapá':
                $state = 'AP';
                break;
            case 'Amazonas':
                $state = 'AM';
                break;
            case 'Bahia':
                $state = 'BA';
                break;
            case 'Espírito Santo':
                $state = 'ES';
                break;
            case 'Goiás':
                $state = 'GO';
                break;
            case 'Maranhão':
                $state = 'MA';
                break;
            case 'Mato Grosso':
                $state = 'MT';
                break;
            case 'Mato Grosso do Sul':
                $state = 'MS';
                break;
            case 'Minas Gerais':
                $state = 'MG';
                break;
            case 'Pará':
                $state = 'PA';
                break;
            case 'Paraíba':
                $state = 'PB';
                break;
            case 'Paraná':
                $state = 'PR';
                break;
            case 'Pernambuco':
                $state = 'PE';
                break;
            case 'Piauí':
                $state = 'PI';
                break;
            case 'Rio de Janeiro':
                $state = 'RJ';
                break;
            case 'Rio Grande do Norte':
                $state = 'RN';
                break;
            case 'Rio Grande do Sul':
                $state = 'RS';
                break;
            case 'Rondônia':
                $state = 'RO';
                break;
            case 'Roraima':
                $state = 'RR';
                break;
            case 'Santa Catarina':
                $state = 'SC';
                break;
            case 'São Paulo':
                $state = 'SP';
                break;
            case 'Sergipe':
                $state = 'SE';
                break;
            case 'Tocantins':
                $state = 'TO';
                break;
            case 'Distrito Federal':
                $state = 'DF';
                break;
        }
        return $state;
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