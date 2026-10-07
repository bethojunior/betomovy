<?php

namespace app\dao;

use app\utils\BaseDao;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 26/02/2019
 * Time: 10:47
 */
class RewardTripDao extends BaseDao
{
    protected $table = 'rewardTrip';

    public function findOne($rewardTripId)
    {
        $sql = "
            SELECT
                rt.id,
                rt.value,
                rt.rewardTripTypeId,
                rt.created_at,
                rtt.name AS rewardType
            FROM {$this->table} rt
              INNER JOIN rewardTripType rtt ON rt.rewardTripTypeId = rtt.id
              WHERE rt.id = :id
        ";

        $bind = [
            ':id' => $rewardTripId
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }

    public function findByTripAndDriver($tripReference, $driverId)
    {
        $sql = "
            SELECT
                rt.id,
                rt.value,
                rt.rewardTripTypeId,
                rt.created_at,
                rt.tripReference,
                rt.driverId,
                rtt.name AS rewardType
            FROM {$this->table} rt
              INNER JOIN rewardTripType rtt ON rt.rewardTripTypeId = rtt.id
              WHERE 
                rt.tripReference = :tripReference AND
                rt.driverId = :driverId
        ";

        $bind = [
            ':tripReference' => $tripReference,
            ':driverId' => $driverId,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }

    /**
     * @param $id
     * @param $value
     * @return bool
     * @throws Exception
     */
    public function updateValue($id, $value)
    {
        return $this->sqlUpdate(
            ['value' => ':value'],
            [['id', '=', ':id']],
            [':id' => $id, ':value' => $value]
        );
    }
}