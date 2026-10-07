<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/06/2019
 * Time: 18:15
 */

namespace App\Repositories\Trip;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Trip\Zone;

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
            ->first([
                'idZone',
                'radius',
                'greaterRadius',
                'longDistanceRadius',
                'cityId',
            ]);
    }

    public function findByCentral($centralId)
    {
        return $this->getModel()
            ::where('centralId', $centralId)
            ->where('statusId', StatusConst::ACTIVE)
            ->first([
                'idZone',
                'radius',
                'greaterRadius',
                'centralId',
            ]);
    }
}
