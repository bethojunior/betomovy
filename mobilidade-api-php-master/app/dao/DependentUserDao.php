<?php

namespace app\dao;

use app\utils\BaseDao;
use Exception;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/12/2019
 * Time: 10:43
 */
class DependentUserDao extends BaseDao
{
    protected $table = "dependentUser";

    public function getAllByResponsible($responsibleId)
    {
        $sql = "
            SELECT
                du.id AS dependentUserId,
                du.userId,
                u.name,
                u.email,
                u.phone,
                du.relationship,
                c.idCustomer,
                du.active,
                cRS.name AS registerStatus,
                du.created_at
            FROM dependentUser du
                INNER JOIN user u on du.userId = u.idUser
                INNER JOIN customer c on u.idUser = c.userId
                INNER JOIN customerRegisterStatus cRS on c.customerRegisterStatusId = cRS.idCustomerRegisterStatus
                WHERE
                      du.statusId = :statusId AND
                      du.responsibleId = :responsibleId AND
                      u.statusId = :statusId
        ";

        $bind = [
            ':statusId' => Status::ATIVO,
            ':responsibleId' => $responsibleId,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    public function find($id)
    {
        return $this->sqlSelect([], [
            ['id', '=', ':id']
        ], [], 1)
            ->bind([':id' => $id])
            ->get(false);
    }

    /**
     * @param $id
     * @return bool
     * @throws Exception
     */
    public function delete($id)
    {
        return $this->sqlUpdate(
            ['statusId' => ':statusId'],
            [['id', '=', ':id']],
            [
                ':statusId' => Status::EXCLUIDO,
                ':id' => $id
            ]);
    }
}