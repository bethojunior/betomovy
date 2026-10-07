<?php

require_once dirname(__FILE__) . "/Charge.php";
require_once dirname(__FILE__) . "/Reversal.php";
require_once dirname(__FILE__) . "/ConnectionCotaBank.php";

class CotaBank
{
    private $charge;
    private $reversal;
    private $connection;
    public function __construct(string $user, string $password, string $environment)
    {
        $this->connection = new ConnectionCotaBank($user, $password, $environment);
        $this->charge = new Charge($this->connection);
        $this->reversal = new Reversal($this->connection);
    }

    public function getCharge(): Charge
    {
        return $this->charge;
    }

    public function getReversal(): Reversal
    {
        return $this->reversal;
    }
}
