<?php

namespace App\Services\Central;

use App\Models\Central\Neighborhood;
use App\Repositories\Central\NeighborhoodRepository;
use App\Utils\Polygon;
use Illuminate\Support\Facades\DB;

class NeighborhoodService
{
    private $repository;

    public function __construct(NeighborhoodRepository $repository)
    {
        $this->repository = $repository;
    }

    public function store(array $request)
    {
        $neighborhood = new Neighborhood($request);
        $polygon = Polygon::polygonToString($request['area']);
        $neighborhood->area = DB::raw("ST_GeomFromText({$polygon})");
        $neighborhood->save();

        return $neighborhood;
    }

    public function findAll($cityId = null)
    {
        return $this->repository->findAll($cityId);
    }

    public function delete($id)
    {
        $neighborhood = $this->repository->find($id);
        $neighborhood->delete();
    }
}
