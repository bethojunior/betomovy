<?php



class Charge
{
    public $connection;

    public function __construct(ConnectionCotaBank $connection)
    {
        $this->connection = $connection;
    }

    public function creditCard(array $dataCharge)
    {
        $this->connection->authorization();
        $dataCharge = $this->setCharge($dataCharge);
        return $this->connection->post('/v2/transaction', $dataCharge);
    }

    public function veirfy(string $id)
    {
        $this->connection->authorization();
        $data = array(
            "tid" => $id
        );
        return $this->connection->post('/v2/verify',$data);
    }


    public function setCharge(array $charge)
    {
        try {
            $this->charge = array(
                "pan" => "",
                "cardholderName" => "",
                "expirationDate" => "",
                "cvvStatus" => "",
                "cvv" => "",
                "brand" => "",
                "amount" => "",
                "date" => "",
                "paymentType" => "",
                "installments" => "",
                "site" => "",
                "splitMode" => "",
                "sellerChannel" => "",
                "productsCategory" => "",
                "customer" => [
                    "gender" => "",
                    "login" => "",
                    "name" => "",
                    "ddd" => "",
                    "phone" => "",
                    "email" => "",
                    "documentType" => "",
                    "document" => "",
                    "birthDate" => "",
                    "ip" => "",
                    "fingerPrint" => "",
                    "billing" => [
                        "street" => "",
                        "number" => "",
                        "neighborhood" => "",
                        "city" => "",
                        "state" => "",
                        "country" => "r",
                        "zipcode" => ""
                    ],
                    "shipping" => null
                ],
                "products" => [
                    [
                        "name" => "",
                        "price" => "",
                        "quantity" => "",
                        "sku" => ""
                    ]
                ]
            );
            $this->charge = array_merge($this->charge, $charge);
            return $this->charge;
        } catch (ChargeException $e) {
            return 'error generating billing - ' . $e->getMessage();
        }
    }
}



