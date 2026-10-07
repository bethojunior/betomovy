<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/03/2019
 * Time: 13:45
 */
class RefusedCustomerDao extends BaseDao
{
    protected $table = "refusedCustomer";

    public function getAll($driverId)
    {
        $sql = "
            SELECT
                rc.id,
                c.idCustomer,
                uc.name AS customerName,
                uc.nickname AS customerNickname,
                c.profileImage AS customerImage
            FROM {$this->table} rc
              INNER JOIN customer c on rc.customerId = c.idCustomer
              INNER JOIN user uc on c.userId = uc.idUser
            WHERE rc.driverId = :driverId AND rc.statusId = :status
        ";

        $bind = [
            ':driverId' => $driverId,
            ':status' => Status::ATIVO,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    /**
     * @param $idRefused
     * @return bool
     * @throws Exception
     */
    public function delete($idRefused)
    {
        return $this->sqlUpdate(
            ['statusId' => ':status'],
            [['id', '=', ':idRefused']],
            [':status' => Status::EXCLUIDO, ':idRefused' => $idRefused]
        );
    }
}