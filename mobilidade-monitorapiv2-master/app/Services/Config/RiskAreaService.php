<?php

namespace App\Services\Config;

use App\Repositories\Config\RiskAreaRepository;

class RiskAreaService
{
    protected $repository;

    public function __construct(RiskAreaRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll($cityId, array $request)
    {
        return $this->repository->findAll($cityId, $request);
    }

    public function refuse($id)
    {
        $this->repository->refuse($id);
    }

    public function confirm($id, array $request)
    {
        $this->repository->confirmed($id, $request);
    }
}
