<?php

namespace App\Repositories\Central;

use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Central\Neighborhood;

class NeighborhoodRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(Neighborhood::class);
    }

    public function findByCityArea($lat, $lng)
    {
        return $this->getModel()
            ::join("cityArea", "neighborhood.cityId", "cityArea.cityId")
            ->where("cityArea.statusId", StatusConst::ACTIVE)
            ->whereRaw("ST_CONTAINS(cityArea.polygon, POINT(?, ?))", [$lat, $lng])
            ->select([
                "neighborhood.id",
                "neighborhood.name"
            ])
            ->get();
    }


    public function findByArea($lat, $lng)
    {
        return $this->getModel()
            ::whereRaw("ST_CONTAINS(neighborhood.area, POINT(?, ?))", [$lat, $lng])
            ->first();
    }
}
