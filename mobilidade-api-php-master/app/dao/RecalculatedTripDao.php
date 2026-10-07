<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/07/2019
 * Time: 15:11
 */
class RecalculatedTripDao extends BaseDao
{
    protected $table = 'recalculatedTrip';

    public function findByTrip($tripReference)
    {
        return $this->sqlSelect(
            [],
            [
                ['tripReference', '=', ':tripReference']
            ])
            ->bind([':tripReference' => $tripReference])
            ->get(false);
    }

    public function findByTripAndRecalculatedTripType(string $tripReference, int $recalculatedTripTypeId)
    {
        return $this->sqlSelect(
            [],
            [
                ['tripReference', '=', ':tripReference', 'AND'],
                ['recalculatedTripTypeId', '=', ':recalculatedTripTypeId'],
            ])
            ->bind([
                ':tripReference' => $tripReference,
                ':recalculatedTripTypeId' => $recalculatedTripTypeId,
            ])
            ->get();
    }

    public function findLast($tripReference)
    {
        return $this->sqlSelect(
            [],
            [
                ['tripReference', '=', ':tripReference']
            ],
            ['created_at', 'DESC'])
            ->bind([':tripReference' => $tripReference])
            ->first();
    }
}