<?php

namespace app\dao;

use app\constant\DriverCalledConst;
use app\utils\BaseDao;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 18/01/2019
 * Time: 14:42
 */
class DriverCalledDao extends BaseDao
{
    protected $table = "driverCalled";

    //antes de chamar o driver, verificar se ele ainda possui horas disponiveis

    public function getByTrip($tripReference)
    {
        $sql = "
            SELECT
              dC.id,
              dC.driverId,
              dC.tripReference,
              dC.proximity,
              dC.created_at,
              dC.updated_at,
              dC.status,
              u.deviceToken
            FROM {$this->table} dC
              INNER JOIN tripDrivers tD ON dC.tripReference = tD.tripReference
              INNER JOIN driver d ON dC.driverId = d.idDriver
              INNER JOIN user u ON d.userId = u.idUser
            WHERE dC.tripReference = :tripReference;
        ";

        $bind = [':tripReference' => $tripReference];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    public function getByTripWithCount($tripReference)
    {
        $sql = "
            SELECT
              dC.id,
              dC.driverId,
              dC.tripReference,
              dC.proximity,
              dC.created_at,
              dC.updated_at,
              dC.status,
              u.deviceToken,
              COUNT(dC.driverId) AS quantity
            FROM {$this->table} dC
              INNER JOIN driver d ON dC.driverId = d.idDriver
              INNER JOIN user u ON d.userId = u.idUser
            WHERE dC.tripReference = :tripReference
              GROUP BY dC.driverId;
        ";

        $bind = [':tripReference' => $tripReference];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    /**
     * @param $tripReference
     * @return array|mixed
     */
    public function getRenewedList($tripReference)
    {
        $sql = "
            SELECT
              dC.id,
              dC.driverId,
              dC.tripReference,
              dC.proximity,
              dC.created_at,
              dC.updated_at,
              dC.status,
              u.deviceToken
            FROM {$this->table} dC
              INNER JOIN tripDrivers tD ON dC.tripReference = tD.tripReference
              INNER JOIN driver d ON dC.driverId = d.idDriver
              INNER JOIN user u ON d.userId = u.idUser
            WHERE dC.tripReference = :tripReference AND dC.status IS NULL;
        ";

        $bind = [':tripReference' => $tripReference];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    /**
     * @param $tripReference
     * @return array|mixed
     */
    public function getRenewedListByAllDriversClose($tripReference)
    {
        $sql = "
            SELECT
              dC.id,
              dC.driverId,
              dC.tripReference,
              dC.proximity,
              dC.created_at,
              dC.updated_at,
              dC.status,
              u.deviceToken
            FROM {$this->table} dC
              INNER JOIN tripDrivers tD ON dC.tripReference = tD.tripReference
              INNER JOIN driver d ON dC.driverId = d.idDriver
              INNER JOIN user u ON d.userId = u.idUser
            WHERE dC.tripReference = :tripReference AND dC.status = :status;
        ";

        $bind = [
            ':tripReference' => $tripReference,
            ':status' => DriverCalledConst::CALLING,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    /**
     * @param $tripReference
     * @param $driverId
     * @param $status
     * @return bool
     * @throws Exception
     */
    public function updateStatus($tripReference, $driverId, $status)
    {
        return $this->sqlUpdate(
            [
                'status' => ':status',
                'updated_at' => 'UTC_TIMESTAMP()',
            ],
            [
                ['tripReference', '=', ':tripReference', 'AND'],
                ['driverId', '=', ':driverId']
            ],
            [
                ':status' => $status,
                ':tripReference' => $tripReference,
                ':driverId' => $driverId,
            ]
        );
    }

    /**
     * @param $driverCalledId
     * @param $status
     * @return bool
     * @throws Exception
     */
    public function updateStatusById($driverCalledId, $status)
    {
        return $this->sqlUpdate(
            [
                'status' => ':status',
                'updated_at' => 'UTC_TIMESTAMP()',
            ],
            [
                ['id', '=', ':id']
            ],
            [
                ':status' => $status,
                ':id' => $driverCalledId,
            ]
        );
    }

    /**
     * @param array $driverCalledIds
     * @param $status
     * @return bool
     * @throws Exception
     */
    public function updateManyStatusById(array $driverCalledIds, $status)
    {
        $idsString = implode(',', $driverCalledIds);

        return $this->sqlUpdate(
            [
                'status' => ':status',
                'updated_at' => 'UTC_TIMESTAMP()',
            ],
            [
                ['id', 'IN', "({$idsString})"]
            ],
            [
                ':status' => $status,
            ]
        );
    }

    public function getStatusDriver($tripReference, $driverCalledId)
    {
        $sql = "
            SELECT
              dC.id,
              dC.driverId,
              dC.tripReference,
              dC.proximity,
              dC.created_at,
              dC.updated_at,
              dC.status,
              u.deviceToken
            FROM {$this->table} dC
              INNER JOIN driver d on dC.driverId = d.idDriver
              INNER JOIN user u on d.userId = u.idUser
            WHERE 
              dC.tripReference = :tripReference AND
              dC.id = :id
            ORDER BY dC.updated_at DESC LIMIT 1;
        ";

        $bind = [':tripReference' => $tripReference, ':id' => $driverCalledId];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }

    public function getStatusAllDrivers($tripReference)
    {
        $sql = "
            SELECT
              dC.id,
              dC.driverId,
              dC.tripReference,
              dC.proximity,
              dC.created_at,
              dC.updated_at,
              dC.status,
              u.deviceToken
            FROM {$this->table} dC
              INNER JOIN driver d on dC.driverId = d.idDriver
              INNER JOIN user u on d.userId = u.idUser
            WHERE 
              dC.tripReference = :tripReference AND
              dC.status <> :status
            ORDER BY dC.updated_at DESC;
        ";

        $bind = [':tripReference' => $tripReference, ':status' => DriverCalledConst::NOT_ANSWERED];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }
}