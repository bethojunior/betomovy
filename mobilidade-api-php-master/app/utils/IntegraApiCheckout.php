<?php

namespace app\utils;

use app\contracts\CheckoutInterface;
use app\exceptions\CheckoutServiceException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/02/2023
 * Time: 14:29
 */
class IntegraApiCheckout implements CheckoutInterface
{
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

    private $base_url = "https://banking-api-sdx.integrapay.com.br/api/v1/";

    /**
     * Parametros alimentados pelo setParameters()
     */
    private $sale_id;
    private $value;
    private $document;
    private $phone;
    private $name;
    private $email;
    private $capture;

    private $card;

    public function __construct(string $api_token)
    {
        $this->api_token = $api_token;
        $this->test = !(env('ENV') == 'production');
    }

    public function __get($name)
    {
        // TODO: Implement __get() method.
        return $this->$name ?? 11;
    }

    /**
     * @return array
     * @throws CheckoutServiceException
     */
    public function creditPayment()
    {
        $result = $this->curlExec(
            'simples-token/cartao',
            'POST',
            [
                "card_id" => $this->card['ipCardId'],
                "valor" => $this->value,
                "parcelas" => 1,
                "captura" => true,
                "documento" => $this->document,
                "celular" => strval($this->phone),
            ]);

        if (!isset($result['status']) || $result['status'] !== "Pago")
            throw new CheckoutServiceException(150, $result);

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
        
        $response = $this->curlExec("cartao/{$paymentId}/estornar", 'POST',  ["status" => true]);
        $response = [
            "refund" => true,
            "status" => "Cancelado"
        ];
        return $response;
    }

    /**
     * @param $customerId
     * @param $value
     * @param $token
     * @param $description
     * @return array
     * @throws Exception
     */
    public function reserveAmount()
    {
       
        $result = $this->curlExec(
            'simples-token/cartao',
            'POST',
            [
                "card_id" => $this->card['cardId'],
                "valor" => $this->value,
                "parcelas" => 1,
                "captura" => false,
                "documento" => $this->document,
                "celular" => strval($this->phone),

            ]);

        if (!isset($result['status']) || $result['status_string'] !== "Pré-autorizado")
            throw new CheckoutServiceException(150, $result);

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
        $result = $this->curlExec("transacao/{$paymentId}", 'GET');

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
        $result = $this->curlExec(
            "cartao/token",
            'POST',
            [
                "comprador_nome" => $data['user']['name'],
                "comprador_tipo" => 1,
                "comprador_documento" => FormatValue::formatDocumentClear($data['docNumber'], '###.###.###-##'),
                "comprador_email" => $data['user']['email'],
                "comprador_celular" => FormatValue::formatPhoneClear($data['user']['phone']),
                "nome" => strtoupper($data['cardholderName']),
                "numero" => str_replace(' ', '', $data['cardNumber']),
                "cvv" => $data['cvv'],
                "mes" => intval($data['expirationMonth']),
                "ano" => intval($data['expirationYear'])
            ]
        );

        return $result;
    }

    public function searchPayment(array $params)
    {
        // TODO: Implement searchPayment() method.
    }

    /**
     * @return mixed
     * @throws CheckoutServiceException
     */


    public function captureAmount($paymentId, $amount = null)
    {
        return $this->curlExec(
            "cartao/{$paymentId}/captura",
            'POST',
            [
                "valor" => $amount
            ]
        );
    }

    /**
     * @param $paymentId
     * @return array
     */
    public function cancelReserve($paymentId)
    {
        return $this->curlExec(
            "cartao/{$paymentId}/estornar",
            'POST',
            [
                "success" => true
            ]
        );
    }

    private function curlExec($actionUri, $method, $data = null)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt(
            $ch,
            CURLOPT_URL,
            $this->base_url . $actionUri);
            
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        
        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                "Content-Type: application/json",
                "Accept: application/json",
                "Authorization: Bearer $this->api_token"
            ]);
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