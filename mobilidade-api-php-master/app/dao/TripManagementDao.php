<?php

namespace app\dao;

use app\constant\ZoneConst;
use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/01/2019
 * Time: 15:50
 */
class TripManagementDao extends BaseDao
{
    protected $table = "tripDrivers";

    public function findAll()
    {
        return $this->sqlSelect()
            ->get();
    }

    public function getTripsToIncreaseArea()
    {
        return $this->sqlSelect([],
            [
                ["TIME_TO_SEC(TIMEDIFF(:dateNow, date))", ">", "timeToIncrease", "AND"],
                ["zoneId", "NOT IN", "(" . implode(',', ZoneConst::DEFAULT_ZONES) . ")"]
            ]
        )
            ->bind([':dateNow' => now()])
            ->get();
    }
}