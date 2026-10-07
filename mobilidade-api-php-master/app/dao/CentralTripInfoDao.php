<?php

namespace app\dao;

use app\utils\BaseDao;

class CentralTripInfoDao extends BaseDao
{
    protected $centralTripInfoQuestionTable = 'centralTripInfoQuestion';
    protected $centralTripInfoResponseTable = 'centralTripInfoResponse';

    public function findByTripReference($tripReference)
    {
        $sql = "
            SELECT
                cTIQ.title, 
                cTIR.response
            FROM {$this->centralTripInfoQuestionTable} cTIQ
                INNER JOIN {$this->centralTripInfoResponseTable} cTIR ON cTIQ.id = cTIR.centralTripInfoQuestionId
                WHERE
                    cTIR.tripReference = :tripReference 
        ";

        $bind = [
            ':tripReference' => $tripReference,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }
}
