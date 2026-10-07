<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 08/07/2020
 * Time: 19:24
 */

namespace App\Repositories\City;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\City\Zone;

class ZoneRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(Zone::class);
    }

    public function findByCity($cityId)
    {
        return $this->getModel()
            ::where('cityId', $cityId)
            ->where('order', 1)
            ->where('statusId', StatusConst::ACTIVE)
            ->firstOrFail([
                'idZone',
                'radius',
                'greaterRadius',
                'longDistanceRadius',
                'cityId',
            ]);
    }
}
