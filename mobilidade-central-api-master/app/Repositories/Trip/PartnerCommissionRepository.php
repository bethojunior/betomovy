<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/05/2020
 * Time: 16:56
 */

namespace App\Repositories\Trip;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Trip\PartnerCommission;

class PartnerCommissionRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(PartnerCommission::class);
    }

    public function findByCityAndTripType(int $cityId, int $tripTypeId)
    {
        return $this->getModel()
            ::where('cityId', $cityId)
            ->where('tripTypeId', $tripTypeId)
            ->where('statusId', StatusConst::ACTIVE)
            ->first([
                'id',
                'partnerCommissionValue',
                'partnerCommissionType',
                'cityId',
                'tripTypeId'
            ]);
    }
}
