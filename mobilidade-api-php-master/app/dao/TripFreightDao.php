<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Trip;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 09/09/2019
 * Time: 11:26
 */
class TripFreightDao extends BaseDao
{
    protected $table = "trip";

    public function findSimple($tripReference)
    {
        return $this->sqlSelect([],
            [['tripReference', '=', ':tripReference']]
        )
            ->bind([':tripReference' => $tripReference])
            ->get(false);
    }

    public function getScheduled()
    {
        $sql = "
            SELECT
                t.price,
                t.schedule,
                t.date,
                t.duration,
                t.estimatedTripTime,
                t.status,
                tpf.
            FROM {$this->table} t
              INNER JOIN tripType tt ON tt.idTripType = t.tripTypeId
              INNER JOIN tripPaymentForm tpf ON tpf.idTripPaymentForm = t.tripPaymentFormId
              INNER JOIN 
              INNER JOIN 
              WHERE t.status = :status
        ";

        $bind = [
            ':status' => Trip::SCHEDULED
        ];
    }
}