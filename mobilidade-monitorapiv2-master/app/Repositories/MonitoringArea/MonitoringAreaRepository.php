<?php

namespace App\Repositories\MonitoringArea;

use App\Contracts\Repository\AbstractRepository;
use App\Models\Price\Dynamic\MonitoringArea;

class MonitoringAreaRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(MonitoringArea::class);
    }

    public function findAllByCity($cityId)
    {
        return $this->getModel()
            ::where("cityId", $cityId)
            ->select([
                'id',
                'name',
                'cityId',
                'active',
                'area'
            ])
            ->get();
    }
}


