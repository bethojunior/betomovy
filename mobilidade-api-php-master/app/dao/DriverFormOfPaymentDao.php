<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 30/07/2020
 * Time: 10:35
 */
class DriverFormOfPaymentDao extends BaseDao
{
    protected $table = 'driverFormOfPayment';

    public function findByTripPaymentFormAndDriver(int $tripPaymentFormId, int $idDriver)
    {
        $sql = "
            SELECT
                *
            FROM {$this->table} dfp
                WHERE 
                    dfp.tripPaymentFormId = :tripPaymentFormId AND
                    dfp.driverId = :driverId AND
                    dfp.deleted_at IS NULL
        ";

        $bind = [
            ':tripPaymentFormId' => $tripPaymentFormId,
            ':driverId' => $idDriver,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->first();
    }

    public function findByDriver(int $driverId)
    {
        $sql = "
            SELECT
                dfp.id,
                dfp.tripPaymentFormId,
                tpf.name AS tripPaymentForm,
                dfp.created_at,
                dfp.updated_at
            FROM {$this->table} dfp
                INNER JOIN tripPaymentForm tpf ON dfp.tripPaymentFormId = tpf.idTripPaymentForm
                WHERE 
                    dfp.driverId = :driverId AND
                    tpf.statusId = :statusActive AND
                    dfp.deleted_at IS NULL
        ";

        $bind = [
            ':driverId' => $driverId,
            ':statusActive' => Status::ATIVO,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    public function delete(int $driverFormOfPaymentId)
    {
        return $this->sqlUpdate(
            ['deleted_at' => ':deleted_at'],
            [['id', '=', ':driverFormOfPaymentId']],
            [
                ':deleted_at' => now(),
                ':driverFormOfPaymentId' => $driverFormOfPaymentId,
            ]);
    }

    public function deleteAllByDriver(int $driverId)
    {
        return $this->sqlUpdate(
            ['deleted_at' => ':deleted_at'],
            [['driverId', '=', ':driverId']],
            [
                ':deleted_at' => now(),
                ':driverId' => $driverId
            ],
            false
        );
    }
}