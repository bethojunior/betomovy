<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/10/2018
 * Time: 18:07
 */
class OriginDao extends BaseDao
{
    public function find($idOrigin)
    {
        return $this->sqlSelect([], [['idOrigin', '=', ':idOrigin']])
            ->bind([':idOrigin' => $idOrigin])
            ->get(false);
    }

    public function findByTripReference($tripReference)
    {
        $sql = "
            SELECT
                o.*
            FROM {$this->table} o
                INNER JOIN trip ON o.idOrigin = trip.originId
            WHERE 
                trip.tripReference = :tripReference
        ";

        return $this->sqlRawSelect($sql, [':tripReference' => $tripReference])
            ->get(false);
    }

    public function findByTripId($tripId)
    {
        $sql = "
            SELECT
                o.*
            FROM {$this->table} o
                INNER JOIN trip ON o.idOrigin = trip.originId
            WHERE 
                trip.idTrip = :tripId
        ";

        return $this->sqlRawSelect($sql, [':tripId' => $tripId])
            ->get(false);
    }


    public function findByAddressLatAndLng(string $address, float $lat, float $lng)
    {
        $sql = "
            SELECT
                *
            FROM {$this->table} o
                WHERE
                    o.address = :address AND
                    o.latitude = :lat AND
                    o.longitude = :lng
        ";
    }
}