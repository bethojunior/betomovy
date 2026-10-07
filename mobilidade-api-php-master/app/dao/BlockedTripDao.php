<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 06/05/2019
 * Time: 15:41
 */
class BlockedTripDao extends BaseDao
{
    protected $table = "flows_in_analysis_view";

    /**
     * @return array|mixed
     */
    public function findBlockedTrips()
    {
        $sql = /** @lang sql */ "
            SELECT
                t.idTrip,
                t.tripReference,
                t.status,
                t.price,
                t.`date`,
                t.tripPaymentFormId,
                t.tripAuditId
            FROM blocked_trips_view t
        ";

        return $this->sqlRawSelect($sql)
            ->get();
    }

    /**
     * @param $tripReference
     * @return array|mixed
     */
    public function findBlockedBalanceFlows($tripReference)
    {
        $sql = "
            SELECT
                bt.*
            FROM {$this->table} bt
              WHERE bt.tripReference = :tripReference
        ";

        $bind = [
            ':tripReference' => $tripReference
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }
}