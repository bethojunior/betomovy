<?php

namespace app\dao;

use app\constant\TripCancellationCustomerFeeConst;
use app\utils\BaseDao;
use Exception;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 08/04/2019
 * Time: 19:10
 */
class TripCancellationCustomerFeeDao extends BaseDao
{
    protected $table = 'tripCancellationCustomerFee';

    /**
     * @param $userId
     * @return array|mixed
     */
    public function findByUser($userId)
    {
        return $this->sqlSelect(
            [],
            [
                ['userId', '=', ':userId', 'AND'],
                ['billing_status', '=', ':billing_status', 'AND'],
                ['statusId', '=', ':statusId']
            ]
        )
            ->bind([
                ':userId' => $userId,
                ':statusId' => Status::ATIVO,
                ':billing_status' => TripCancellationCustomerFeeConst::TO_COLLECT,
            ])
            ->get();
    }

    public function findByTrip($tripReference)
    {
        $sql = "
            SELECT
                tccf.*,
                tcft.name AS title,
                tcft.description
            FROM {$this->table} tccf
              INNER JOIN tripCancellationFeeType tcft ON tccf.tripCancellationFeeTypeId = tcft.id
            WHERE 
              tccf.tripReference = :tripReference
            LIMIT 1
        ";

        $bind = [
            ':tripReference' => $tripReference,
        ];

        $fee = $this->sqlRawSelect($sql, $bind)
            ->get(false);

        return empty($fee) ? null : $fee;
    }

    /**
     * @param $id
     * @param $tripReference
     * @return bool
     * @throws Exception
     */
    public function updatePaidTripReference($id, $tripReference)
    {
        return $this->sqlUpdate(
            [
                'paid_tripReference' => ':tripReference',
                'statusId' => ':statusId',
                'updated_at' => ':updated_at',
                'billing_status' => ':billing_status',
            ],
            [['id', '=', ':id']],
            [
                ':tripReference' => $tripReference,
                ':statusId' => Status::ATIVO,
                ':updated_at' => now(),
                ':billing_status' => TripCancellationCustomerFeeConst::TRANSFERRED,
                ':id' => $id,
            ]
        );
    }

    /**
     * @param $id
     * @param $scheduledPaymentDate
     * @param null $transactionId
     * @return bool
     * @throws Exception
     */
    public function putToScheduledTransfer($id, $scheduledPaymentDate, $transactionId = null)
    {
        $set = [
            'updated_at' => ':updated_at',
            'scheduledPaymentDate' => ':scheduledPaymentDate',
            'billing_status' => ':billing_status',
        ];

        $bind = [
            ':updated_at' => now(),
            ':scheduledPaymentDate' => $scheduledPaymentDate,
            ':billing_status' => TripCancellationCustomerFeeConst::RELEASED_TO_TRANSFER,
            ':id' => $id,
        ];

        if ($transactionId) {
            $set['transactionId'] = ':transactionId';
            $bind[':transactionId'] = $transactionId;
        }

        return $this->sqlUpdate(
            $set,
            [['id', '=', ':id']],
            $bind
        );
    }

    /**
     * @param $id
     * @return bool
     * @throws Exception
     */
    public function updateScheduledCancellation($id)
    {
        return $this->sqlUpdate(
            [
                'statusId' => ':statusId',
                'updated_at' => ':updated_at',
                'billing_status' => ':billing_status',
            ],
            [['id', '=', ':id']],
            [
                ':statusId' => Status::EXCLUIDO,
                ':updated_at' => now(),
                ':billing_status' => TripCancellationCustomerFeeConst::TRANSFERRED,
                ':id' => $id,
            ]
        );
    }

    /**
     * @return array|mixed
     */
    public function getReleasedFees()
    {
        $sql = "
            SELECT
              tc.*,
              d.balanceId,
              u.name,
              u.deviceToken
            FROM tripCancellationCustomerFee tc
              INNER JOIN driver d on tc.driverId = d.idDriver
              INNER JOIN user u on d.userId = u.idUser
              WHERE
                tc.statusId = :statusId AND
                tc.billing_status = :released_status AND
                tc.scheduledPaymentDate < :scheduledPaymentDate
            ORDER BY tc.created_at ASC;
        ";

        $bind = [
            ':statusId' => Status::ATIVO,
            ':released_status' => TripCancellationCustomerFeeConst::RELEASED_TO_TRANSFER,
            ':scheduledPaymentDate' => todayEndOfDay()
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }
}