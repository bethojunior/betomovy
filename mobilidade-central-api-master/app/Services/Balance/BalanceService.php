<?php

namespace App\Services\Balance;

use App\Repositories\Balance\BalanceRepository;

class BalanceService
{
    public function __construct(BalanceRepository $repository)
    {
        $this->repository = $repository;
    }

    public function find($id){
        {
            return $this->repository->findById($id);
        }
    }
}
