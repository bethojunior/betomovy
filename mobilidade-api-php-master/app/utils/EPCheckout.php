<?php

namespace app\utils;

use app\constant\FinancialIntermediaryConst;
use app\contracts\CheckoutInterface;
use app\exceptions\CheckoutServiceException;
use app\exceptions\IpagException;
use app\model\Config;
use app\utils\Pulse\GroupIds;
use app\utils\Pulse\PulseService;

class EPCheckout implements CheckoutInterface
{
    // Não remover esta constante, é utilizada para identificar o intermediário financeiro no "feedTransaction"
    private $financialIntermediaryId = FinancialIntermediaryConst::EPAG;
    private $sale_id;
    private $value;
    private $description;
    private $bearerToken;
    private $card;
    private $phone;
    private $email;
    private $baseURL = "https://api-expert.704pay.com.br/";


    public function __construct($configs = null)
    {
        $this->bearerToken = $configs['epag_secret'] ?? null;
    }

    public function __get($name)
    {
        return $this->$name ?? null;
    }

    public function creditPayment()
    {
      $appName = Config::get('app_title');
      $name = $this->shortName($appName);
      $amount = bcmul($this->value, '100', 0);
      $payment = $this->httpRequest('POST', 'payments/api/sales', [
        "amount" => $amount,
        "payment" => [
          "type" => "credit",
          "installments" => 1,
          "capture" => true,
          "has_interest" => false,
          "delayed_split" => false,
          "authenticate" => false,
          "softdescriptor" => $name,
          "currency_code" => "BRL",
          "card" => [
            "brand" => $this->identifyBrand($this->card["number"]),
            "vault" => $this->card["cardId"]
          ],
        ],
        "customer" => [
          "name" => $this->card["cardholderName"],
          "document" => $this->removeAccents($this->card["holderDocument"]),
        ],
    ]);

    if ($payment['http_code'] !== 200) {
        $bodyString = print_r($payment['body'], true);
        throw new \Exception("Erro ao criar pagamento: " . $bodyString);
    }

    return $payment;
    }

    public function debitPayment()
    {
        // Implementação do pagamento a débito
    }
    
    public function reserveAmount()
    {
        $appName = Config::get('app_title');
        $name = $this->shortName($appName);
        $amount = bcmul($this->value, '100', 0);
        $payment = $this->httpRequest('POST', 'payments/api/sales', [
            "amount" => $amount,
            "payment" => [
            "type" => "credit",
            "installments" => 1,
            "capture" => false,
            "has_interest" => false,
            "delayed_split" => false,
            "authenticate" => false,
            "softdescriptor" => $name,
            "currency_code" => "BRL",
            "card" => [
                "brand" => $this->identifyBrand($this->card["number"]),
                "vault" => $this->card["cardId"]
            ],
            ],
            "customer" => [
            "name" => $this->card["cardholderName"],
            "document" => $this->removeAccents($this->card["holderDocument"]),
            "email" => $this->email,
            "phone" => preg_replace('/\D/', '', $this->phone)
            ],
        ]);

        $this->handlePaymentErrors($payment, $name);

        return $payment;
    }

    public function pixPayment(array $data)
    {
        $pixPayment = $this->httpRequest("POST", "payments/api/sales/pix", [
            "amount" => $data["amount"],
            "orderId" => "2360c77b-8a82-463d-b875-543b234fd087",
            "dueDate" => $data["dueDate"],
            "customer" => [
                "name" => $data["customer"]["name"] ?? "Cliente",
            ],
        ]);

        if ($pixPayment['http_code'] !== 201) {
            $bodyString = print_r($pixPayment['body'], true);
            throw new \Exception("Erro ao criar pagamento Pix: " . $bodyString);
        }

        return $pixPayment;
    }

    public function findPaymentPix(string $paymentId)
    {
        $pixPayment = $this->httpRequest("GET", "payments/api/sales/pix/" . $paymentId);

        if ($pixPayment['http_code'] !== 200) {
            $bodyString = print_r($pixPayment['body'], true);
            throw new \Exception("Erro ao buscar pix: " . $bodyString);
        }

        return json_decode(json_encode($pixPayment["body"]));
    }

    public function refundPixPayment($paymentId, $amount = null)
    {
        $pixPayment = $this->httpRequest("POST", "payments/api/sales/pix/" . $paymentId . "/returns", [
            "amount" => $amount,
            "returnReasonCode" => "FR01"
        ]);

        $this->handlePaymentErrors($pixPayment);

        return $pixPayment;
    }

    public function captureAmount($paymentId, $amount = null)
    {
        $value = bcmul($amount, '100', 0);
        $capture = $this->httpRequest("POST", "payments/api/sales/" . $paymentId . "/capture", [
            "amount" => $value
        ]);

        $this->handlePaymentErrors($capture);

        return $capture;
    }

    public function refundCreditPayment($paymentId, $amount = null)
    {
        $refund = $this->httpRequest('POST', 'payments/api/sales/' . $paymentId . '/cancel');

        if ($refund['http_code'] !== 200) {
            $bodyString = print_r($refund['body'], true);
            throw new \Exception("Erro ao estornar pagamento: " . $bodyString);
        }

        return $refund;
    }

    public function refundDebitPayment($paymentId, $amount = null)
    {
        // Implementação de estorno de pagamento a débito
    }

    public function findPayment($paymentId)
    {
        // Implementação de busca de pagamento
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
        // Implementação de inserção de cliente
    }

    public function insertCard($customerId, $data, $token = null)
    {
        $card = $this->httpRequest('POST', 'payments/api/vaults/cards', $data);

        if ($card['http_code'] !== 200) {
            $bodyString = print_r($card['body'], true);
            throw new \Exception("Erro ao inserir cartão: " . $bodyString);
        }

        return $card;
    }

    public function searchPayment(array $params)
    {
        // Implementação de pesquisa de pagamento
    }

    public function splitPayment($paymentId)
    {
        // Implementação de divisão de pagamento
    }

    public function hasSplit(): bool
    {
        // Implementação de verificação de split
        return true; // true ou false, dependendo da lógica
    }

    /**
     * @param $cardNumber
     * @return string
     * @throws CheckoutServiceException
     */
    private function identifyBrand($cardNumber)
    {
        switch ($cardNumber) {
            case (bool)preg_match('/^(5067|4576|4011)/', $cardNumber) :
                return 'elo';

            case (bool)preg_match('/^(4)/', $cardNumber) :
                return 'visa';

            case (bool)preg_match('/^(50)/', $cardNumber) :
                return 'aura';

            case (bool)preg_match('/^(5)/', $cardNumber) :
                return 'mastercard';

            case (bool)preg_match('/^(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)/', $cardNumber) :
                return 'mastercard';

            case (bool)preg_match('/^(636368|438935|504175|451416|636297)/', $cardNumber) :
                return 'elo';

            case (bool)preg_match('/^(606282)/', $cardNumber) :
                return 'hipercard';

            case (bool)preg_match('/^(6011)/', $cardNumber) :
                return 'discover';

            case (bool)preg_match('/^(60)/', $cardNumber) :
                return 'hipercard';

            case (bool)preg_match('/^(3841)/', $cardNumber) :
                return 'hipercard';

            case (bool)preg_match('/^(622)/', $cardNumber) :
                return 'discover';

            case (bool)preg_match('/^(301|305)/', $cardNumber) :
                return 'diners';

            case (bool)preg_match('/^(34|37)/', $cardNumber) :
                return 'amex';

            case (bool)preg_match('/^(36|38)/', $cardNumber) :
                return 'diners';

            case (bool)preg_match('/^(64|65)/', $cardNumber) :
                return 'discover';

            case (bool)preg_match('/^(35)/', $cardNumber) :
                return 'jcb';

            default:
                throw new CheckoutServiceException(152, compact('cardNumber'));
        }
    }


    private function shortName($name)
    {
        if (strlen($name) <= 13) {
            return $name;
        } else {
            return substr($name, 0, 13);
        }
    }

    private function removeAccents($string) {
        return preg_replace(
            '/[^A-Za-z0-9 ]/',
            '',
            iconv('UTF-8', 'ASCII//TRANSLIT', $string)
        );
    }

    private function handlePaymentErrors(array $response, $nameApp = null): void
    {
        $code = $response['http_code'] ?? null;
        $body = $response['body'] ?? [];
        $app = $nameApp ?? Config::get('app_title');

        $pulseService = new PulseService(
            'api-php-' . $app,
            GroupIds::PAYMENT_API_PHP,
        );

        if ($code !== 200) {
            if (!empty($body['error']['message'])) {
                throw new \RuntimeException($body['error']['message'], $body['error']['code'] ?? 400);
                $pulseService->handle(
                    $body['error']['message'],
                    "app/utils/EPCheckout.php",
                    'critical'
                );
            }

            $pulseService->handle(
                print_r($body, true),
                "app/utils/EPCheckout.php",
                'critical'
            );

            throw new \RuntimeException('Erro desconhecido na reserva de valor.', $code ?? 500);
        }
        if( isset($body['status']) && $body['status'] == 7) {
            $pulseService->handle(
                $body['returnCode'] . ' - ' . $body['returnMessage'],
                "app/utils/EPCheckout.php",
                'critical'
            );
            $code = (int) $body['returnCode'];
            throw new IpagException($code);
        }
    }

    /**
     * @param string $method
     * @param string $url
     * @param array $headers
     * @param array|null $data
     * @param string|null $token
     * @return array
     */
    protected function httpRequest(string $method, string $endpoint, ?array $data = null, $token = null): array
    {
        $ch = curl_init();

        $token = $token ? $token : $this->bearerToken;

        $options = [
            CURLOPT_URL => $this->baseURL . $endpoint,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => strtoupper($method),
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $token,
            ],
        ];

        if (!is_null($data)) {
            $options[CURLOPT_POSTFIELDS] = json_encode($data);
            $headers[] = 'Content-Type: application/json';
        }

        curl_setopt_array($ch, $options);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);

        curl_close($ch);

        return [
            'success' => $error === '',
            'http_code' => $httpCode,
            'body' => json_decode($response, true),
            'error' => $error,
        ];
    }
}
