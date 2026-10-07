<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/05/2019
 * Time: 16:32
 */
class ManagerDao extends BaseDao
{
    public function find($id)
    {
        return $this->sqlSelect([],
            [['id', '=', ':id']]
        )
            ->bind([':id' => $id])
            ->get(false);
    }

    public function findByUserId($userId)
    {
        $sql = "
            SELECT
                m.id,
                u.idUser,
                u.email,
                u.name,
                u.phone,
                d.profileImage,
                m.managerRegisterStatusId,
                m.valueCommission,
                m.valueTypeCommission,
                m.partnerCommission,
                m.partnerTypeCommission,
                CONCAT(c.value, TO_BASE64(u.idUser)) AS indicationLink,
                u.api_token
            FROM manager m
                INNER JOIN user u ON m.userId = u.idUser
                INNER JOIN config c ON c.`key` = 'link_manager_indication'
                LEFT JOIN driver d on u.idUser = d.userId
                WHERE 
                    u.idUser = :userId AND 
                    u.statusId = :status
                LIMIT 1;
        ";

        $bind = [
            ':userId' => $userId,
            ':status' => Status::ATIVO,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }

    public function authenticate($email, $passwordBase64Encoded)
    {
        $sql = "
            SELECT
                m.id,
                u.idUser,
                u.email,
                u.name,
                u.phone,
                d.profileImage,
                m.managerRegisterStatusId,
                m.valueCommission,
                m.valueTypeCommission,
                m.partnerCommission,
                m.partnerTypeCommission,
                CONCAT(c.value, TO_BASE64(u.idUser)) AS indicationLink,
                u.api_token
            FROM manager m
                INNER JOIN user u ON m.userId = u.idUser
                INNER JOIN config c ON c.`key` = 'link_manager_indication'
                LEFT JOIN driver d on u.idUser = d.userId
                WHERE 
                    u.email = :email AND 
                    u.statusId = :status AND
                    u.password = :password
                LIMIT 1;
        ";

        $bind = [
            ':email' => $email,
            ':password' => $passwordBase64Encoded,
            ':status' => Status::ATIVO,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }
}