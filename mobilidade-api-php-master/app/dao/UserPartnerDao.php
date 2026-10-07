<?php

namespace app\dao;

use app\utils\BaseDao;
use app\utils\PDOPagination;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 21/06/2019
 * Time: 19:15
 */
class UserPartnerDao extends BaseDao
{
    protected $table = 'user';

    public function findByEmail($email, $userId)
    {
        $sql = "
            SELECT
                u.idUser,
                u.name,
                u.email,
                u.phone,
                p.idPartner,
                p.nameEstablishment,
                p.addressEstablishment,
                p.latitude,
                p.longitude,
                p.function,
                p.partnerRegisterStatusId,
                p.managerId,
                m.userId AS managerUserId,
                c.profileImage
            FROM {$this->table} u
              INNER JOIN partner p ON p.userId = u.idUser
              LEFT JOIN customer c ON u.idUser = c.userId
              LEFT JOIN manager m ON p.managerId = m.id
            WHERE 
              u.email LIKE :email AND
              p.statusId = :statusId AND
              u.idUser <> :userId
            LIMIT 1
        ";

        $bind = [
            ':email' => $email,
            ':statusId' => Status::ATIVO,
            ':userId' => $userId,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }

    public function findPartners($userId, $page = 1)
    {
        $sql = "
            SELECT
                u.idUser,
                u.name,
                u.email,
                u.phone,
                p.idPartner,
                p.nameEstablishment,
                p.addressEstablishment,
                p.latitude,
                p.longitude,
                p.function,
                p.partnerRegisterStatusId,
                p.managerId,
                m.userId AS managerUserId,
                c.profileImage
            FROM {$this->table} u
              INNER JOIN partner p ON p.userId = u.idUser
              INNER JOIN manager m ON p.managerId = m.id
              LEFT JOIN customer c ON u.idUser = c.userId
            WHERE 
              m.userId = :userId AND
              p.statusId = :statusId
        ";

        $bind = [
            ':userId' => $userId,
            ':statusId' => Status::ATIVO,
        ];

        $paginator = new PDOPagination($sql, $bind);

        return $paginator->paginate($page, 10);
    }
}