<?php

namespace App\Repositories\Enum;

use App\Contracts\Repository\AbstractRepository;
use App\Models\Enum\Bank;

class BankRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(Bank::class);
    }
}
