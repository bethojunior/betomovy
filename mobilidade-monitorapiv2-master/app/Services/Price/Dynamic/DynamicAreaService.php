<?php

namespace App\Services\Price\Dynamic;

use App\Models\Price\Dynamic\DynamicArea;
use App\Repositories\Price\Dynamic\DynamicAreaRepository;
use App\Utils\Polygon;
use App\Utils\PolygonUpdated;
use Illuminate\Support\Facades\DB;

class DynamicAreaService
{
    protected $repository;

    public function __construct(DynamicAreaRepository $repository)
    {
        $this->repository = $repository;
    }

    public function store(array $request)
    {
        $dynamicArea = new DynamicArea($request);
        $area = Polygon::polygonToString($request['area']);
        $dynamicArea->area = DB::raw("ST_GeomFromText({$area})");
        $dynamicArea->save();

        return $dynamicArea;
    }

    public function findAllByCity($cityId)
    {
        $dynamics =  $this->repository->findAllByCity($cityId);

        $dynamics = array_map(function ($item) {
            $item['area'] = Polygon::polygonToArray($item['area']);
            return (object) $item;
        }, $dynamics->toArray());

        return $dynamics;
    }

    public function update(int $id, array $request)
    {
        $dynamicArea = $this->repository->find($id);

        $dynamicArea->fill($request);

        if (isset($request['area'])) {
            $area = PolygonUpdated::polygonToStringUpdated($request['area']);
            $dynamicArea->area = DB::raw("ST_GeomFromText({$area})");
        }

        $dynamicArea->save();

        return $dynamicArea;
    }

    public function delete($id)
    {
        $dynamic = $this->repository->find($id);
        $dynamic->delete();
    }

    public function changeStatus($id, $active)
    {
        $dynamic = $this->repository->find($id);
        $dynamic->active = $active;
        $dynamic->save();
    }
}
