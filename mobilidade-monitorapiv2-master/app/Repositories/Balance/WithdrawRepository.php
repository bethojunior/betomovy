<?php

namespace App\Repositories\Balance;

use App\Contracts\Repository\AbstractRepository;
use App\Models\Balance\Withdraw;

class WithdrawRepository extends AbstractRepository
{
    function __construct()
    {
        $this->setModel(Withdraw::class);
    }

    public function findAll(array $request = [])
    {
        return $this->getModel()
            ::orderByDesc('created_at')
            ->get();
    }

    public function findWhereIn(string $column = 'idWithdraw', array $request)
    {
        return $this->getModel()
            ::whereIn($column, $request)
            ->get();
    }

}
