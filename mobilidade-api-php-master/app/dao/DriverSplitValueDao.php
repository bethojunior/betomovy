<?php

namespace app\dao;

use app\utils\BaseDao;
use app\utils\Connection;
use Exception;

class DriverSplitValueDao extends BaseDao
{
    protected $table = 'driverSplitValue';

    public function findByTripAndDriver(int $tripId, int $driverId)
    {
        $sql = /** @lang sql */ "
            SELECT
                id,
                driverId,
                tripId,
                transactionId,
                amount,
                driverSplitValue.status,
                driver.balanceId,
                log,
                created_at,
                updated_at
            FROM
                driverSplitValue
            INNER JOIN driver ON driverSplitValue.driverId = driver.idDriver
            WHERE
                driverId = :driverId AND
                tripId = :tripId
        ";

        $params = [
            ':driverId' => $driverId,
            ':tripId'   => $tripId
        ];

        return $this->sqlRawSelect($sql, $params)
            ->first();
    }

    /**
     * @throws Exception
     */
    public function incrementsAmount(int $id, int $amount): void
    {
        $sql = /** @lang sql */ "
            UPDATE
                driverSplitValue
            SET
                amount = amount + :amount,
                updated_at = :updated_at
            WHERE
                id = :id
        ";

        $params = [
            ':amount'     => $amount,
            ':updated_at' => now(),
            ':id'         => $id
        ];

        $this->sqlRawUpdate($sql, $params, false);
    }

    /**
     * @throws Exception
     */
    public function decrementsAmount(int $id, int $amount): void
    {
        $sql = /** @lang sql */ "
            UPDATE
                driverSplitValue
            SET
                amount = amount - :amount,
                updated_at = :updated_at
            WHERE
                id = :id
        ";

        $params = [
            ':amount'     => $amount,
            ':updated_at' => now(),
            ':id'         => $id
        ];

        $this->sqlRawUpdate($sql, $params, false);
    }

    /**
     * @throws Exception
     */
    public function updateStatusAndTransaction(int $id, string $status, ?string $transactionId): void
    {
        $sql = /** @lang sql */ "
            UPDATE
                driverSplitValue
            SET
                status = :status,
                transactionId = :transactionId,
                updated_at = :updated_at
            WHERE
                id = :id
        ";

        $params = [
            ':status'        => $status,
            ':transactionId' => $transactionId,
            ':id'            => $id,
            ':updated_at'    => now()
        ];

        $this->sqlRawUpdate($sql, $params, false);
    }
}