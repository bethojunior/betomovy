<?php

namespace Delivery\Utils;

class ConfianceCheckout
{
    private $apiUrl;
    private $token;
    private $establishment;

    public function __construct(string $token, int $establishment, string $environment = 'production')
    {
        $this->apiUrl = 'https://api.zsystems.com.br/';
        $this->token = $token;
        $this->establishment = $establishment;
    }

    public function creditPayment(array $dataTransation = [])
    {
        try {
            $typePaymentCredit = 3;
            $data = [
                "cartao" => [
                    "codigoSeguranca" => $dataTransation['card_cvc'],
                    "numero" => $dataTransation['card_number'],
                    "titular" => $dataTransation['card_holder'],
                    "validade" => $dataTransation['card_validate']
                ],
                "cliente" => [
                    "celular" => $dataTransation['customer_phone_number'],
                    "cpf" => $dataTransation['customer_document'],
                    "dataNascimento" => $dataTransation['customer_birth_date'],
                    "email" => $dataTransation['customer_email'],
                    "nome" => $dataTransation['customer_name'],
                ],
                "endereco" => [
                    "cep" => $dataTransation['customer_zicode'] ?? null,
                    "cidade" => $dataTransation['customer_name'] ?? null,
                    "complemento" => $dataTransation['customer_complement'] ?? null,
                    "estado" => $dataTransation['customer_state'] ?? null,
                    "logradouro" => $dataTransation['customer_address'] ?? 'S/L',
                    "numero" => $dataTransation['customer_number'] ?? 'S/N',
                ],
                "estabelecimentoId" => $this->establishment,
                "ip" => $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? null,
                "parcelas" => 1,
                "splits" => [
                ],
                "tipoPagamentoId" => $typePaymentCredit,
                "valor" => $dataTransation['value']
            ];

            return $this->curlExec('vendas' , 'POST', $data);

        } catch (\Exception $e) {
            throw  new \Exception('Erro ao processar pagamento, tente novamente');
        }
    }

    public function refundCreditPayment($paymentId)
    {
        return $this->curlExec("vendas/$paymentId/estornar");
    }

    private function curlExec($actionUri, $method = 'POST', $data = null)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_URL, $this->apiUrl . $actionUri);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 0);
        curl_setopt($ch, CURLOPT_TIMEOUT, 4000);
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
            throw new \Exception('Ocorreu um erro ao efetuar o pagamento, por favor, tente novamente mais tarde.');
        }

        return $response ? get_object_vars($response) : $response;
    }
}
