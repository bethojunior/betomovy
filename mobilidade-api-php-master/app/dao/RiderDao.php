<?php

namespace app\dao;

use app\utils\BaseDao;
use Exception;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 21/12/2019
 * Time: 11:02
 */
class RiderDao extends BaseDao
{
    public function findByRidersAndUser($rideId, $userId)
    {
        return $this->sqlSelect([], [
            ['rideId', '=', ':rideId', 'AND'],
            ['userId', '=', ':userId']
        ])
            ->bind([
                ':rideId' => $rideId,
                ':userId' => $userId
            ])
            ->get();
    }

    public function findByRide($rideId)
    {
        $sql = /** @lang sql */
            "
            SELECT
                r.id,
                rtc.id AS riderTripCustomerId,
                r.value,
                r.tripPaymentFormId,
                r.userId,
                IFNULL(tc.name, u.name) AS name,
                IFNULL(tc.phone, u.phone) AS phone,
                IFNULL(tc.document, u.document) AS document,
                IFNULL(tc.email, u.email) AS email,
                IFNULL(tc.document, u.document) AS document,
                IFNULL(u.deviceToken, '') as deviceToken,
                IF(c.profileImage IS NULL, c.profileImage, CONCAT(cf.value, 'customer/profile/', c.profileImage)) AS profileImage,
                r.created_at,
                u.name as responsibleName,
                IF(tc.name is null, true, false) as isResponsible
            FROM {$this->table} r
                INNER JOIN tripPaymentForm tpf ON tpf.idTripPaymentForm = r.tripPaymentFormId
                INNER JOIN riderTripCustomer rtc ON r.id = rtc.riderId
                INNER JOIN config cf ON cf.`key` = 'link_storage_pictures'
                LEFT JOIN tripCustomer tc ON rtc.tripCustomerId = tc.id
                LEFT JOIN user u ON u.idUser = r.userId
                LEFT JOIN customer c ON c.userId = u.idUser
            WHERE
                r.rideId = :rideId AND r.statusId = :statusId
        ";

        $bind = [
            ':rideId' => $rideId,
            ':statusId' => Status::ATIVO,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    /**
     * @param $riderId
     * @return bool
     * @throws Exception
     */
    public function cancelRider($riderId)
    {
        return $this->sqlUpdate([
            'statusId' => ':statusId'
        ], [
            ['id', '=', ':riderId']
        ], [
            ':statusId' => Status::EXCLUIDO,
            ':riderId' => $riderId
        ]);
    }
}