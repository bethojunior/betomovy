<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 16/03/2019
 * Time: 13:28
 */
class RewardCampaignTripDao extends BaseDao
{
    protected $table = "rewardCampaignTrip";

    public function findByTrip($tripReference)
    {
        $sql = "
            SELECT
                rct.*,
                rtt.name AS rewardType
            FROM {$this->table} rct
              INNER JOIN rewardTripType rtt ON rct.rewardTripTypeId = rtt.id
            WHERE rct.tripReference = :tripReference
        ";

        $bind = [':tripReference' => $tripReference];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    public function findByTripAndRewardTripType($tripReference, $rewardTripTypeId)
    {
        $sql = "
            SELECT
                rct.*,
                rtt.name AS rewardType
            FROM {$this->table} rct
              INNER JOIN rewardTripType rtt ON rct.rewardTripTypeId = rtt.id
            WHERE 
              rct.tripReference = :tripReference AND
              rct.rewardTripTypeId = :rewardTripTypeId
            LIMIT 1
        ";

        $bind = [
            ':tripReference' => $tripReference,
            ':rewardTripTypeId' => $rewardTripTypeId
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }
}