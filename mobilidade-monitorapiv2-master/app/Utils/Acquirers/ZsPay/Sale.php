<?php

namespace App\Utils\Acquirers\ZsPay;

class Sale
{
    private $connection;

    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }

    public function find($id)
    {
        return $this->connection->get('/vendas/'. $id);
    }
}
