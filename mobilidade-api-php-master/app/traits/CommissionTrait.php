<?php

namespace app\traits;

use app\constant\CommissionTypeConst;
use app\exceptions\CommissionException;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/12/2019
 * Time: 12:06
 */
trait CommissionTrait
{
    /**
     * @param $type
     * @param $commissionValue
     * @param $grossValue
     * @return float|int
     * @throws CommissionException
     */
    protected function getValueByType($type, $commissionValue, $grossValue)
    {
        switch ($type) {
            case CommissionTypeConst::PERCENTAGE:
                return $this->percentage($grossValue, $commissionValue);
            case CommissionTypeConst::FIXED_VALUE:
                return $commissionValue;
            default:
                throw new CommissionException(
                    1450,
                    compact($type)
                );
        }
    }

    /**
     * Calcula porcentagem
     * @param $value
     * @param $percentage
     * @return float|int
     */
    protected function percentage($value, $percentage)
    {
        return $value * ($percentage / 100);
    }
}