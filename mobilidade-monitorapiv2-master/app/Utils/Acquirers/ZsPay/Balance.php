<?php

namespace App\Utils\Acquirers\ZsPay;

class Balance
{
    private $connection;

    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }

    public function accountBalance(int $establishment)
    {
        return $this->connection->get('/estabelecimentos/' . $establishment . '/saldo');
    }
}
