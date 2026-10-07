<?php

namespace App\Services\Central;

use App\Repositories\Central\NeighborhoodRepository;

class NeighborhoodService
{
    private $repository;

    public function __construct(NeighborhoodRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findByCityArea(array $request)
    {
        return $this->repository->findByCityArea($request['lat'], $request['lng']);
    }
}
