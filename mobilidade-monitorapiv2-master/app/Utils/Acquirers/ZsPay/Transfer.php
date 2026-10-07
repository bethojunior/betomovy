<?php

namespace App\Utils\Acquirers\ZsPay;

class Transfer
{
    private $connection;

    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }

    public function create(array $data)
    {
        return $this->connection->post('/transferencias',$data);
    }

    public function refund($paymentId)
    {
        return $this->connection->post("vendas/" . $paymentId . "/estornar");
    }
}
