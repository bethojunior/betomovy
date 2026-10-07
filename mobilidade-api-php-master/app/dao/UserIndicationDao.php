<?php

namespace app\dao;

use app\utils\BaseDao;
use app\utils\PDOPagination;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/06/2019
 * Time: 11:22
 */
class UserIndicationDao extends BaseDao
{
    protected $table = 'userIndication';

    public function findIndicated($userId)
    {
        return $this->sqlSelect([],
            [['userIndicatedId', '=', ':userIndicatedId']],
            [], 1
        )
            ->bind([
                ':userIndicatedId' => $userId
            ])
            ->get(false);
    }

    public function getIndicatedUsersByWhoIndicated($userId, $cityId = null, $page = 1)
    {
        $where = $cityId ?
            " AND d.cityId = :cityId" : "";

        $sql = /** @lang sql */
            "
            SELECT
                ui.userIndicatedId,
                u_indicated.name AS indicated_name,
                u_indicated.nickname AS indicated_nickname,
                u_indicated.phone AS indicated_phone,
                u_indicated.email AS indicated_email,
                uT.name AS indicated_type,
                IFNULL(d.profileImage, c.profileImage) AS profileImage,
                d.status AS driverStatus,
                ci.nome AS cityName,
                ui.created_at
            FROM userIndication ui
                INNER JOIN user u_indicated on ui.userIndicatedId = u_indicated.idUser
                INNER JOIN user u_who_indicated on ui.whoIndicatedId = u_who_indicated.idUser
                INNER JOIN levelAccess lA on u_indicated.idUser = lA.userId
                INNER JOIN userType uT on lA.userTypeId = uT.idUserType
                LEFT JOIN driver d on u_indicated.idUser = d.userId
                LEFT JOIN customer c on u_indicated.idUser = c.userId
                LEFT JOIN city ci on d.cityId = ci.id
            WHERE
              ui.whoIndicatedId = :userId AND
              ui.statusId = 1
              {$where}
              ORDER BY u_indicated.name;
        ";

        $bind = [':userId' => $userId];

        if ($cityId)
            $bind += [':cityId' => $cityId];

        $paginator = new PDOPagination($sql, $bind);

        return $paginator
            ->paginate($page);
    }

    public function getIndicationsToFeeDevolution()
    {
        $now = now();

        $sql = /** @lang sql */
            "
            SELECT
                ui.*,
                d.*
            FROM userIndication ui
                INNER JOIN manager m on ui.whoIndicatedId = m.userId
                INNER JOIN driver d on d.userId = ui.userIndicatedId
                WHERE
                  ui.refund_to_fees_up_to IS NOT NULL AND
                  :now BETWEEN ui.created_at AND ui.refund_to_fees_up_to
                ORDER BY ui.created_at;
        ";

        $bind = [
            ':now' => $now
        ];

        return
            $this->sqlRawSelect($sql, $bind)
                ->get();
    }

    public function findWhoIndicated($userId)
    {
        $sql = /** @lang sql */
            "
            SELECT
                u.*,
                IFNULL(d.balanceId, c.balanceId) AS balanceId,
                IF(d.idDriver IS NULL, false, true) AS isDriver
            FROM userIndication ui
              INNER JOIN user u ON ui.whoIndicatedId = u.idUser
              LEFT JOIN driver d on u.idUser = d.userId
              LEFT JOIN customer c on u.idUser = c.userId
              WHERE
                ui.userIndicatedId = :userId AND
                ui.statusId = :status
              LIMIT 1;
        ";

        $bind = [
            ':userId' => $userId,
            ':status' => Status::ATIVO
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }
}