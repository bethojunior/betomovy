<?php

namespace App\Repositories\Price\Dynamic;

use App\Contracts\Repository\AbstractRepository;
use App\Models\Price\Dynamic\DynamicArea;

class DynamicAreaRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(DynamicArea::class);
    }

    public function findById($id)
    {
        return $this->getModel()::find($id);
    }

    public function findAllByCity($cityId)
    {
        return $this->getModel()
            ::where("cityId", $cityId)
            ->select([
                'id',
                'name',
                'multiplierValue',
                'cityId',
                'active',
                'startTime',
                'endTime'
            ])
            ->whereNotNull(["startTime","endTime"])
            ->selectRaw('ST_AsText(area) AS area')
            ->get();
    }

    public function availableForScheduling($time, $cityId, $name)
    {
        return $this->getModel()
            ::where("startTime","<=", $time)
            ->where("endTime",">=", $time)
            ->where("active",true)
            ->where("cityId",$cityId)
            ->where("name",$name)
            ->exists();
    }

    public function availableForSchedulingUpdate($time, $id, $name)
    {
        $conflict = $this->getModel()
            ::where("active", true)
            ->where("name", $name)
            ->where("id", "!=", $id)
            ->where("startTime", "!=", $time)
            ->exists();

        if ($conflict) {
            return true;
        }

        return $this->getModel()
            ::where("active", true)
            ->where("id", $id)
            ->exists();
    }
}
