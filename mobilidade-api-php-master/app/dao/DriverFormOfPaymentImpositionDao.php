<?php


namespace app\dao;

use app\utils\BaseDao;

class DriverFormOfPaymentImpositionDao extends BaseDao
{
    protected $table = 'driverFormOfPaymentImposition';

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
                    dfp.deleted_at IS NULL
        ";

        $bind = [
            ':driverId' => $driverId
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

}