<?php

namespace app\utils;

use app\constant\FinancialIntermediaryConst;
use app\contracts\CheckoutInterface;
use app\exceptions\CheckoutServiceException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 01/11/2019
 * Time: 14:43
 */
class RecebeAquiCheckout implements CheckoutInterface
{
    private $financialIntermediaryId = FinancialIntermediaryConst::RECEBE_AQUI;
    /**
     * @var string
     */
    private $client_token;

    private $base_url = "https://{sandbox.}api.recebeaqui.com/api/v3/";

    /**
     * Parametros alimentados pelo setParameters()
     */
    private $sale_id;
    private $value;
    private $description;
    private $email;

    private $card;

    public function __construct(string $client_token)
    {
        $this->client_token = $client_token;

        $this->base_url = env('ENV') == 'production' ?
            str_replace('{sandbox.}', '', $this->base_url) :
            str_replace(['{', '}'], '', $this->base_url);
    }

    public function __get($name)
    {
        // TODO: Implement __get() method.
        return $this->$name ?? null;
    }

    public function creditPayment()
    {
        $data = [
            'tokenCliente' => $this->client_token,
            'valor' => $this->value,
            'quantidadeParcelas' => 1,
            'descricaoPagamento' => $this->description,
            'numeroCartao' => $this->card['number'],
            'nomeCartao' => $this->card['cardholderName'],
            'validadeCartao' => $this->getCardExpirationDate(),
            'cvvCartao' => $this->card['cvv'],
            'emailParaComprovante' => $this->email,
        ];

        $result = $this->curlExec('Pagamentos/PagarComCartao', 'POST', $data);

        if (is_array($result))
            $result['valor'] = $this->value;

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
        $data = [
            'tokenCliente' => $this->client_token,
            'idPagamento' => (int)$paymentId
        ];

        $result = $this->curlExec('Pagamentos/Cancelar', 'POST', $data);

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
        return false;
    }

    public function insertCard($customerId, $data, $token = null)
    {
        // TODO: Implement insertCard() method.
        return false;
    }

    public function searchPayment(array $params)
    {
        // TODO: Implement searchPayment() method.
        return false;
    }

    private function getCardExpirationDate()
    {
        return
            $this->card['expirationMonth'] .
            '/' .
            $this->card['expirationYear'];
    }

    private function curlExec($actionUri, $method, $data = null)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_URL, $this->base_url . $actionUri);

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