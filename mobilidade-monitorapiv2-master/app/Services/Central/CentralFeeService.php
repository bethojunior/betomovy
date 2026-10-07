<?php

namespace App\Services\Central;

use App\Models\Central\CentralFee;
use App\Repositories\Central\CentralFeeRepository;

class CentralFeeService
{
    private $repository;

    public function __construct(CentralFeeRepository $repository)
    {
        $this->repository = $repository;
    }

    public function store(array $request)
    {
        $this->repository->disableFee();

        $centralFee = new CentralFee();
        $centralFee->returnFee = $request['returnFee'];
        $centralFee->isByKm = $request['isByKm'];
        $centralFee->paidByCentral = $request['paidByCentral'];
        $centralFee->save();

        return $centralFee;
    }

    public function find()
    {
        return $this->repository->findActive();
    }
}
