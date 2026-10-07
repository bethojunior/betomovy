<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Trip;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/11/2018
 * Time: 18:48
 */
class TripSummaryViewDao extends BaseDao
{
    protected $table = "trip_summary_view";

    /**
     * Buscar o resumo de uma viagem
     * @param $tripReference
     * @return array|mixed
     */
    public function find($tripReference)
    {
        return $this->sqlSelect([], [['tripReference', '=', ':tripReference']])
            ->bind([':tripReference' => $tripReference])
            ->get(false);
    }

    /**
     * @param $userId
     * @param array $fields
     * @return array|mixed
     */
    public function getActiveTripsByUser($userId, $fields = [])
    {
        return $this->sqlSelect($fields,
            [
                ['userId', '=', ':userId', 'AND'],
                ['status', '<>', ':finishedStatus', 'AND'],
                ['status', '<>', ':cancelledStatus', 'AND'],
                ['status', '<>', ':notAnswered', 'AND'],
                ['status', '<>', ':paymentRefused', 'AND'],
                ['status', '<>', ':backOff', 'AND'],
                ['status', '<>', ':scheduled', 'AND'],
                ['centralId', 'IS', 'NULL'],
            ]
        )
            ->bind([
                ':userId' => $userId,
                ':finishedStatus' => Trip::FINISHED,
                ':cancelledStatus' => Trip::CANCELED,
                ':notAnswered' => Trip::NOT_ANSWERED,
                ':paymentRefused' => Trip::PAYMENT_REFUSED,
                ':backOff' => Trip::BACK_OFF,
                ':scheduled' => Trip::SCHEDULED,
            ])
            ->get();
    }

    public function getActiveTripsByUserV2($userId)
    {
        $sql = "
            SELECT
                t.tripReference,
                t.status,
                CASE
                   WHEN t.tripCustomerId IS NOT NULL THEN cp.name
                   WHEN t.customerId IS NOT NULL THEN ct.name
                   ELSE u.name
                END AS customerName
            FROM trip t
                INNER JOIN user u ON u.idUser = t.userId
                INNER JOIN customer c ON u.idUser = c.userId
                LEFT JOIN tripCustomer cp on t.tripCustomerId = cp.id
                LEFT JOIN customer ct ON t.customerId = ct.idCustomer
            WHERE
                t.status NOT IN 
                  (:cancelledStatus,:finishedStatus,:backOff,:paymentRefused,:notAnswered,:scheduled) AND
                t.userId = :userId AND
                t.centralId IS NULL
        ";

        $bind = [
            ':userId' => $userId,
            ':finishedStatus' => Trip::FINISHED,
            ':cancelledStatus' => Trip::CANCELED,
            ':notAnswered' => Trip::NOT_ANSWERED,
            ':paymentRefused' => Trip::PAYMENT_REFUSED,
            ':backOff' => Trip::BACK_OFF,
            ':scheduled' => Trip::SCHEDULED,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }
}