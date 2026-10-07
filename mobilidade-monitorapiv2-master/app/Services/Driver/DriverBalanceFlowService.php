<?php

namespace App\Services\Driver;

use App\Repositories\Balance\DriverBalanceFlowRepository;

class DriverBalanceFlowService
{
    /**
     * @var DriverBalanceFlowRepository
     */
    private $repository;

    public function __construct(DriverBalanceFlowRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findByDriver(int $driverid, array $request)
    {
        return $this->repository->findByDriver($driverid, $request);
    }
}
