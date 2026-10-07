<?php


namespace Delivery\Utils;

use App\Models\User;
use Carbon\Carbon;
use Delivery\Models\Acquirer\DeliveryAcquirerMetaData;
use Delivery\Models\Config\Config;
use Delivery\Models\PaymentForm\Card;
use GuzzleHttp\Client;
use PHPUnit\Exception;

class AsaasApi
{
    private const API_URL = 'https://delivery.webpague.com.br/api/';
    private $client;
    private $asaasToken;

    public function __construct()
    {
        $this->client = new Client(['base_uri' => self::API_URL]);
        $this->asaasToken = (DeliveryAcquirerMetaData::query()->where('key', 'asaas_token')->first())->value;
    }

    public function createCustomer($card, $email)
    {

        $response = $this->client->post('customer', [
            'headers' => [
                'token-id' => $this->asaasToken,
                'Accept' => 'application/json'
            ],
            'json' => [
                'name' => $card->cardholderName,
                'email' => $email,
                'cpfCnpj' => $this->removeMask($card->holderDocument),
            ]
        ]);

        return json_decode((string)$response->getBody())->response;
    }

    public function makeChargeCreditCard(User $user, $card, float $value, string $externalReference = '121231321231')
    {
        $appTitle = (Config::query()->where('key', 'app_title')->first())->value;

        $request = [
            'headers' => [
                'token-id' => $this->asaasToken,
                'Accept' => 'application/json'
            ],
            'json' => [
                "customer_id" => $user->id_asaas,
                "description" => "Pagamento pelo aplicativo " . $appTitle,
                "external_reference" => $externalReference,
                "billing_type" => "CREDIT_CARD",
                "value" => $value,
                "due_date" => Carbon::now()->format('Y-m-d'),
                "postal_service" => false,
                "credit_card" => true,
                "credit_card_holder_name" => $card->cardholderName,
                "credit_card_number" => $card->number,
                "credit_card_expiry_month" => $card->expirationMonth,
                "credit_card_expiry_year" => $card->expirationYear,
                "credit_card_ccv" => $card->cvv,
                "credit_card_holder_info_name" => $card->cardholderName,
                "credit_card_holder_info_email" => $user->email,
                "credit_card_holder_info_cpf_cnpj" => $this->removeMask($card->holderDocument),
                "credit_card_holder_info_postal_code" => (string)$user->zipcode,
                "credit_card_holder_info_address_number" => (string)$user->addressNumber,
                "credit_card_holder_info_address_complement" => null,
                "credit_card_holder_info_phone" => $this->removeMask($user->phone),
                "credit_card_holder_info_mobile_phone" => $this->removeMask($user->phone)
            ]
        ];

        $response = $this->client->post('charge/credit_card', $request);

        return json_decode((string)$response->getBody())->response;
    }

    public function cancelCharge(string $paymentId)
    {
        $response = $this->client->post('charge/reversal', [
            'headers' => [
                'token-id' => $this->asaasToken,
                'Accept' => 'application/json'
            ],
            'json' => [
                "id_payment" => $paymentId
            ]
        ]);

        return json_decode((string)$response->getBody());
    }

    private function removeMask(string $text)
    {
        $textWithoutMask = str_replace('(', '', $text);
        $textWithoutMask = str_replace(')', '', $textWithoutMask);
        $textWithoutMask = str_replace('-', '', $textWithoutMask);
        $textWithoutMask = str_replace(' ', '', $textWithoutMask);
        $textWithoutMask = str_replace('.', '', $textWithoutMask);

        return $textWithoutMask;
    }
}
