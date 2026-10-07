<?php


namespace Delivery\Services\User;


use App\Models\User;
use Delivery\Models\PaymentForm\Card;
use Delivery\Models\User\Customer;
use Delivery\Services\PaymentForm\CardService;
use Delivery\Utils\AsaasApi;

class CustomerService
{
    public function updateAddress(int $id, string $zipcode, string $addressNumber)
    {
        $customer = Customer::findOrFail($id);
        $user = User::findOrFail($customer->userId);
        $user->zipcode = $zipcode;
        $user->addressNumber = $addressNumber;
        $user->save();

        return [
            'zipcode' => $user->zipcode,
            'adressNumber' => $user->addressNumber,
        ];
    }

    public function createCustomerInAsaas(array $request)
    {
        $user = User::findOrFail($request['userId']);
        $card = (new CardService())->decode(Card::findOrFail($request['cardId']));

        $response = (new AsaasApi())->createCustomer($card, $user->email);
        $user->id_asaas = $response->id;
        $user->save();
    }
}
