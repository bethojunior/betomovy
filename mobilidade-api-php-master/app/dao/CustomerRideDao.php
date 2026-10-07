<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Trip;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/01/2020
 * Time: 11:07
 */
class CustomerRideDao extends BaseDao
{
    protected $table = 'ride';

    public function findByTrip($tripReference)
    {
        return $this->sqlSelect([], [
            ['tripReference', '=', ':tripReference']
        ], [], 1)
            ->bind([':tripReference' => $tripReference])
            ->first();
    }

    public function findByCoordinate($lat, $lng)
    {
        $sql = /** @lang sql */
            "
            SELECT
                r.id as rideId,
                r.tripReference,
                r.driverId,
                r.routeId,
                r.seatsAvailable,
                r.created_at,
                tS.schedule,
                t.status,
                ro.name,
                t.price,
                r.routeLayout,
                t.status,
                IF(
                    ro.picture IS NULL,
                    CONCAT(
                        (SELECT
                            config.value
                        FROM config
                            WHERE config.`key` = 'link_storage_pictures'),
                        ro.picture
                    ),
                    null
                ) AS picture
            FROM ride r
                INNER JOIN trip t ON r.tripReference = t.tripReference
                INNER JOIN tripScheduled tS on t.tripReference = tS.tripReference
                INNER JOIN route ro ON r.routeId = ro.id
                INNER JOIN cityArea ca ON ro.cityId = ca.cityId
              WHERE
                t.status = :schedule AND
                ST_CONTAINS(ca.polygon, ST_GeomFromText('POINT({$lat} {$lng})')) AND 
                ca.statusId = :statusId AND
                ro.statusId NOT IN (2)
              ORDER BY r.created_at
        ";

        $bind = [
            ':schedule' => Trip::SCHEDULED,
            ':statusId' => 1
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    public function findByCoordinateAllActive($lat, $lng)
    {
        $sql = /** @lang sql */
            "SELECT
                r.id as rideId,
                r.tripReference,
                r.driverId,
                r.routeId,
                r.seatsAvailable,
                r.created_at,
                tS.schedule,
                t.status,
                ro.name,
                t.price,
                r.routeLayout,
                t.status,
                IF(
                    ro.picture IS NULL,
                    CONCAT(
                        (SELECT
                            config.value
                        FROM config
                            WHERE config.`key` = 'link_storage_pictures'),
                        ro.picture
                    ),
                    null
                ) AS picture
            FROM ride r
                INNER JOIN trip t ON r.tripReference = t.tripReference
                INNER JOIN tripScheduled tS on t.tripReference = tS.tripReference
                INNER JOIN route ro ON r.routeId = ro.id
                INNER JOIN cityArea ca ON ro.cityId = ca.cityId
              WHERE
                t.status NOT IN (:finished, :canceled) AND
                ST_CONTAINS(ca.polygon, ST_GeomFromText('POINT({$lat} {$lng})')) AND
                ca.statusId = :statusId AND
                ro.statusId NOT IN (2)
              ORDER BY r.created_at";


        $bind = [
            ':finished' => Trip::FINISHED,
            ':canceled' => Trip::CANCELED,
            ':statusId' => 1
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    public function findActivesByUserId($userId)
    {
        $sql = "
            SELECT
                r.id as rideId,
                r.tripReference,
                r.driverId,
                r.routeId,
                r.seatsAvailable,
                r.created_at,
                tS.schedule,
                t.status,
                ro.name,
                t.price,
                ro.statusId,
                r.routeLayout,
                IF(
                    ro.picture IS NULL,
                    CONCAT(
                        (SELECT
                            config.value
                        FROM config
                            WHERE config.`key` = 'link_storage_pictures'),
                        ro.picture
                    ),
                    null
                ) AS picture
            FROM ride r
                INNER JOIN trip t ON r.tripReference = t.tripReference
                INNER JOIN tripScheduled tS on t.tripReference = tS.tripReference
                INNER JOIN route ro ON r.routeId = ro.id
                INNER JOIN cityArea ca ON ro.cityId = ca.cityId
              WHERE
                t.status NOT IN (:finishedStatus, :canceledStatus, :notAnswered, :paymentRefused, :backOff) AND
                r.id IN (
                    SELECT
                        rr.rideId
                    FROM rider rr
                        WHERE
                            rr.userId = :userId AND
                            rr.statusId = :statusId
                ) AND
                ca.statusId = :statusId AND ro.statusId NOT IN (2)
              ORDER BY r.created_at
        ";

        $bind = [
            ':finishedStatus' => Trip::FINISHED,
            ':canceledStatus' => Trip::CANCELED,
            ':notAnswered' => Trip::NOT_ANSWERED,
            ':paymentRefused' => Trip::PAYMENT_REFUSED,
            ':backOff' => Trip::BACK_OFF,
            ':userId' => $userId,
            ':statusId' => 1
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }


    public function findByUserId($userId)
    {
        $sql = "
            SELECT
                r.id as rideId,
                r.tripReference,
                r.driverId,
                r.routeId,
                r.seatsAvailable,
                r.created_at,
                tS.schedule,
                t.status,
                ro.name,
                t.price,
                r.routeLayout,
                IF(
                    ro.picture IS NULL,
                    CONCAT(
                        (SELECT
                            config.value
                        FROM config
                            WHERE config.`key` = 'link_storage_pictures'),
                        ro.picture
                    ),
                    null
                ) AS picture
            FROM ride r
                INNER JOIN trip t ON r.tripReference = t.tripReference
                INNER JOIN tripScheduled tS on t.tripReference = tS.tripReference
                INNER JOIN route ro ON r.routeId = ro.id
                INNER JOIN cityArea ca ON ro.cityId = ca.cityId
              WHERE
                t.status IN (:finishedStatus) AND
                r.id IN (
                    SELECT
                        rr.rideId
                    FROM rider rr
                        WHERE
                            rr.userId = :userId AND
                            rr.statusId = :statusId
                ) AND
                ca.statusId = :statusId
              ORDER BY r.created_at DESC
        ";

        $bind = [
            ':finishedStatus' => Trip::FINISHED,
            ':userId' => $userId,
            ':statusId' => 1
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }
}