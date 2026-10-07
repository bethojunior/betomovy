<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/06/2019
 * Time: 17:51
 */

namespace App\Repositories\Trip;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Trip\DriverCommission;

class DriverCommissionRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(DriverCommission::class);
    }

    public function findByCityAndTripType($cityId, $tripTypeId)
    {
        return $this->getModel()
            ::where('cityId', $cityId)
            ->where('tripTypeId', $tripTypeId)
            ->where('statusId', StatusConst::ACTIVE)
            ->first([
                'idDriverCommission',
                'value',
                'valueType',
                'cityId',
                'tripTypeId'
            ]);
    }
}
