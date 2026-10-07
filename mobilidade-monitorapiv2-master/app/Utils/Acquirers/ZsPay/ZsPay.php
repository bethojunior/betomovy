<?php

namespace App\Utils\Acquirers\ZsPay;

class ZsPay
{
    private $token;
    private $connection;


    public function __construct(string $token, string $environment = 'production')
    {
        $this->token = $token;
        $this->connection = (new Connection($token, $environment));
    }

    public function getEstablishment(): Establishment
    {
        return (new Establishment($this->connection));
    }

    public function getTransfer(): Transfer
    {
        return (new Transfer($this->connection));
    }

    public function getBalance(): Balance
    {
        return (new Balance($this->connection));
    }

    public function getSale(): Sale
    {
        return (new Sale($this->connection));
    }
}
