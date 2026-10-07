<?php


namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;
use app\model\Trip;

class ScheduleCorporateRouteDao extends BaseDao
{
    protected $table = "scheduleCorporateRoute";

    public function availableOnDate($date)
    {
        $sql = "
            SELECT sCR.*
            FROM {$this->table} sCR
                     INNER JOIN scheduleCorporateRouteWeek sCRW ON sCR.id = sCRW.scheduleCorporateRouteId
            WHERE (WEEKDAY(:date) + 1) = sCRW.day
              AND (sCR.statusId = :status AND sCRW.statusId = :status) AND
                  EXISTS(SELECT *
                    FROM trip t
                             INNER JOIN tripScheduled tS on t.tripReference = tS.tripReference
                    WHERE DATE(tS.schedule) = :date
                      AND t.status = :tripStatus
                      AND t.scheduleCorporateRouteId = sCR.id) = 0
        ";

        $bind = [
            ':status' => Status::ATIVO,
            ':date' => $date,
            ':tripStatus' => Trip::SCHEDULED
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    public function find($id, $withTrash = false)
    {
        $where = $withTrash ? '' : 'sCR.statusId = :statusId AND';

        $sql = "
            SELECT
                sCR.id,
                sCR.schedule,
                sCR.title,
                sCR.vacancies,
                cR.companyId,
                sCR.corporateRouteId
            FROM {$this->table} sCR
               INNER JOIN  corporateRoute cR ON sCR.corporateRouteId = cR.id
            WHERE 
                {$where}
                sCR.id = :id
               LIMIT 1
        ";

        $bind = [
            ':statusId' => Status::ATIVO,
            ':id' => $id,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }

    public function getTripsByDriver($driverId)
    {

        $sql = "
            SELECT
               sCR.id,
               sCR.title,
               t.tripReference,
               tS.schedule,
               t.driverId,
               t.tripReference
            FROM scheduleCorporateRoute sCR
                     INNER JOIN trip t on sCR.id = t.scheduleCorporateRouteId
                     INNER JOIN tripScheduled tS on t.tripReference = tS.tripReference
            WHERE t.driverId = :driverId AND t.status = :status
        ";

        $bind = [
            ':status' => Trip::SCHEDULED,
            ':driverId' => $driverId
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }
}