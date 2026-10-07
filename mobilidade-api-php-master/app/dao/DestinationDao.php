<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Destination;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 02/10/2018
 * Time: 15:33
 */
class DestinationDao extends BaseDao
{
    /**
     * @param $destinationId
     * @param array $fields
     * @return array|mixed
     */
    public function find($destinationId, $fields = [])
    {
        return $this->sqlSelect($fields, [['idDestination', '=', ':destinationId']])
            ->bind([':destinationId' => $destinationId])
            ->get(false);
    }

    /**
     * Destination ID should be filled on argument
     * @param Destination $destination
     * @return bool
     * @throws Exception
     */
    public function updateInfo(Destination $destination): bool
    {
        return $this->sqlUpdate([
            'latitude' => ':latitude',
            'longitude' => ':longitude',
            'address' => ':address',
            'neighborhood' => ':neighborhood',
        ], [
            ['idDestination', '=', ':idDestination']
        ], [
            ':latitude' => $destination->getLatitude(),
            ':longitude' => $destination->getLongitude(),
            ':address' => $destination->getAddress(),
            ':neighborhood' => $destination->getNeighborhood(),
            ':idDestination' => $destination->getIdDestination(),
        ]);
    }
}