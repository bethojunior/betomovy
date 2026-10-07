<?php

namespace app\services;

use app\dao\PartnerCommissionDao;
use app\exceptions\CommissionException;
use app\exceptions\PartnerCommissionException;
use app\services\contracts\CommissionService;
use app\model\PartnerCommission;
use app\model\Trip;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/05/2019
 * Time: 18:02
 */
class PartnerCommissionService extends CommissionService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new PartnerCommissionDao;
    }

    /**
     * @param $id
     * @return \app\model\PartnerCommission
     * @throws PartnerCommissionException
     */
    public function find($id)
    {
        $commission = $this->dao->find($id);

        if (!$commission)
            throw new PartnerCommissionException(1401);

        return new PartnerCommission($commission);
    }

    /**
     * @param Trip $trip
     * @return array
     * @throws PartnerCommissionException
     * @throws CommissionException
     */
    public function calculateCommission(Trip $trip)
    {
        $partnerCommission = $this->find($trip->getPartnerCommissionId());

        $partnerValue = $this->getValueByType(
            $partnerCommission->getPartnerCommissionType(),
            $partnerCommission->getPartnerCommissionValue(),
            $trip->getPrice()
        );

//        $appValue = $this->getValueByType(
//            $partnerCommission->getAppCommissionType(),
//            $partnerCommission->getAppCommissionValue(),
//            $trip->getPrice()
//        );
//
//        $managerValue = $this->getValueByType(
//            $partnerCommission->getManagerCommissionType(),
//            $partnerCommission->getManagerCommissionValue(),
//            $trip->getPrice()
//        );

        $totalValue = $partnerValue;
//            + $appValue
//            + $managerValue;

        return compact(
            'partnerValue',
//            'appValue',
//            'managerValue',
            'totalValue'
        );
    }
}