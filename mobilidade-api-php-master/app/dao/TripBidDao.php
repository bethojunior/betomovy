<?php

namespace app\dao;

use app\model\Trip;
use app\utils\BaseDao;
use app\model\Status;
use Exception;

class TripBidDao extends BaseDao
{
    protected $table = 'tripBid';

    public function hasTripBidByDriver($tripId, $driverId)
    {
        $sql = /** @lang sql */
            "SELECT * FROM tripBid WHERE tripId = :tripId AND driverId = :driverId and statusId = :statusId";

        return $this->sqlRawSelect($sql, [":tripId" => $tripId, ":driverId" => $driverId, ":statusId" => Status::ATIVO])->get(false);
    }

    public function getBidsByTrip(int $tripId)
    {
        $sql = /** @lang sql */
            "select tB.id,
                       tB.price,
                       tB.tripId,
                       tB.driverId,
                       tB.distance,
                       tB.duration,
                       u.name,
                       tB.created_at,
                       u.deviceToken
                from tripBid tB
                         inner join driver d on tB.driverId = d.idDriver
                         inner join user u on d.userId = u.idUser
                where tripId = :tripId and tB.statusId = :statusId";

        return $this->sqlRawSelect($sql, [":tripId" => $tripId, ":statusId" => Status::ATIVO])->get();
    }

    public function disableAllBidsByTrip(int $tripId)
    {
        $sql = /** @lang sql */
            "update tripBid set statusId = :statusId where tripId = :tripId";

        try {
            return $this->sqlRawUpdate($sql, [":tripId" => $tripId, ":statusId" => Status::EXCLUIDO]);
        } catch (Exception $exception) {
            return null;
        }
    }

    public function find($id)
    {
        $sql = /** @lang sql */
            "select
                    tB.tripId,
                    tB.driverId,
                    tB.price,
                    t.tripReference
                from tripBid tB
                    inner join trip t on tB.tripId = t.idTrip
                where tB.id = :id";

        return $this->sqlRawSelect($sql, [":id" => $id])->get(false);
    }

    public function refuse($tripBidId)
    {
        return $this->sqlUpdate(
            ['statusId' => ':statusId'],
            [['id', '=', ':id']],
            [
                ':statusId' => Status::EXCLUIDO,
                ':id' => $tripBidId
            ]
        );
    }

    public function getAllBidByDrivers()
    {
        $sql = "
            SELECT
                t.tripReference,
                t.status,
                t.userId,
                u.name as customerName,
                t.date as tripDate
            FROM trip t
            INNER JOIN user u ON u.idUser = t.userId
            WHERE
              t.isOffer = :isOffer AND
              t.status = :tripScheduledStatus
        ";

        $bind = [
            ':isOffer' => Status::ATIVO,
            ':tripScheduledStatus' => Trip::GET_BID_BY_DRIVERS,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    public function getInitialPrice($tripReference, $voucher = null) 
    {
        if (!$voucher) {
            $sql = /** @lang sql */ "
            SELECT
                t.tripReference,
                tr.value,
                tcp.cardId
            FROM trip t
                INNER JOIN tripCardPayment tcp ON tcp.tripReference = t.tripReference
                INNER JOIN transaction tr ON tr.idTransaction = tcp.transactionId
                WHERE t.tripReference = :tripReference
                ORDER BY tr.idTransaction DESC
                LIMIT 1
            ";
        } else {
            $sql = /** @lang sql */ "
            SELECT
                t.tripReference,
                bf.value
            FROM trip t
                INNER JOIN balanceFlow bf ON bf.tripReference = t.tripReference
                WHERE t.tripReference = :tripReference
                ORDER BY bf.idBalanceFlow DESC
                LIMIT 1
            ";
        }

        $bind = [
            ':tripReference' => $tripReference,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }
}