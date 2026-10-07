<?php

namespace App\Services\Central;

use App\Models\Central\CentralNeighborhood;
use App\Repositories\Central\CentralNeighborhoodRepository;

class CentralNeighborhoodService
{
    private $repository;

    public function __construct(CentralNeighborhoodRepository $repository)
    {
        $this->repository = $repository;
    }

    public function store(array $request)
    {
        if ($this->repository->hasTripTypeInNeighborhoodByCentral($request['tripTypeId'], $request['neighborhoodId'], $request['centralId']))
            throw new \Exception("Tipo de tarifa já possui cadastro nesse bairro");
        $centralNeighborhood = new CentralNeighborhood($request);
        $centralNeighborhood->save();
        return $centralNeighborhood;
    }

    public function findByCentral($centralId)
    {
        return $this->repository->findByCentral($centralId);
    }

    public function delete(CentralNeighborhood $centralNeighborhood)
    {
        $centralNeighborhood->delete();
    }
}
