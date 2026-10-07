<?php

namespace App\Repositories\Central;

use App\Contracts\Repository\AbstractRepository;
use App\Models\Central\Neighborhood;

class NeighborhoodRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(Neighborhood::class);
    }

    public function findAll($cityId = null)
    {
        return $this->getModel()
            ::where("cityId", $cityId)
            ->select([
                'id',
                'name',
                'cityId'
            ])
            ->get();
    }
}
