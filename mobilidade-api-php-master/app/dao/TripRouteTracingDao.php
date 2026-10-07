<?php

namespace app\dao;

use app\utils\BaseDao;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 06/11/2019
 * Time: 16:52
 */
class TripRouteTracingDao extends BaseDao
{
    protected $table = 'tripRouteTracing';

    public function findByTrip($tripReference)
    {
        return $this->sqlSelect(['tripReference', 'tracing'], [['tripReference', '=', ':tripReference']])
            ->bind([':tripReference' => $tripReference])
            ->get(false);
    }

    /**
     * @param $tripReference
     * @param $tracing
     * @return bool
     * @throws Exception
     */
    public function updateRoute($tripReference, $tracing)
    {
        return $this->sqlUpdate(
            [
                'tracing' => ':tracing'
            ],
            [
                ['tripReference', '=', ':tripReference']
            ],
            [
                ':tracing' => $tracing,
                ':tripReference' => $tripReference,
            ]
        );
    }
}