<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 27/02/2019
 * Time: 11:11
 */
class TripWayPointDao extends BaseDao
{
    protected $table = 'tripWayPoint';

    public function find($id)
    {
        return $this->sqlSelect([],
            [['id', '=', ':id']]
        )
            ->bind([':id' => $id])
            ->get(false);
    }

    /**
     * @param $tripReference
     * @return array|mixed
     */
    public function findByTrip($tripReference)
    {
        $sql = "
            SELECT
                twp.*,
                rpst.name AS pitStopTypeName
            FROM {$this->table} twp
                LEFT JOIN routePitStopType rpst ON twp.routePitStopTypeId = rpst.id
                WHERE
                    twp.tripReference = :tripReference AND 
                    twp.statusId = :status
        ";

        $bind = [
            ':tripReference' => $tripReference,
            ':status' => Status::ATIVO
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    public function findByTripNotConfirmation($tripReference)
    {
        $sql = "
            SELECT
                twp.*,
                rpst.name AS pitStopTypeName
            FROM {$this->table} twp
                LEFT JOIN routePitStopType rpst ON twp.routePitStopTypeId = rpst.id
                WHERE
                    twp.tripReference = :tripReference AND 
                    twp.statusId = :status AND 
                    twp.confirmed = false
        ";

        $bind = [
            ':tripReference' => $tripReference,
            ':status' => Status::ATIVO
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    /**
     * @param $id
     * @return bool
     * @throws Exception
     */
    public function confirm($id)
    {
        return $this->sqlUpdate(
            ['confirmed' => true],
            [['id', '=', ':id']],
            [':id' => $id]
        );
    }

    /**
     * @param $tripReference
     * @return bool
     * @throws Exception
     */
    public function disabled($tripReference)
    {
        return $this->sqlUpdate(
            ['statusId' => Status::EXCLUIDO],
            [
                ['tripReference', '=', ':tripReference', 'and'],
                ['confirmed', '=', ':confirmed'],
            ],
            [
                ':tripReference' => $tripReference,
                ':confirmed' => false
            ],
            false
        );
    }
}