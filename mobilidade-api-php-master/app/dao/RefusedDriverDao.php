<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/03/2019
 * Time: 17:34
 */
class RefusedDriverDao extends BaseDao
{
    protected $table = 'refusedDriver';

    public function getAll($customerId)
    {
        $sql = "
            SELECT
                rd.id,
                d.idDriver,
                d.status AS statusDriver,
                ud.name AS driverName,
                ud.nickname AS driverNickname,
                d.profileImage AS driverImage,
                c.plate
            FROM {$this->table} rd
              INNER JOIN driver d on rd.driverId = d.idDriver
              LEFT JOIN car c on d.idDriver = c.driverId
              INNER JOIN user ud on d.userId = ud.idUser
            WHERE rd.customerId = :customerId AND rd.statusId = :status
        ";

        $bind = [
            ':customerId' => $customerId,
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

    public function getAllDriversBlockedByCustomer($driverId)
    {
        $sql = "
            SELECT
                rd.id,
                ud.idUser,
                rd.customerId,
                d.idDriver,
                d.status AS statusDriver,
                ud.name AS driverName,
                ud.nickname AS driverNickname,
                d.profileImage AS driverImage
            FROM {$this->table} rd
              INNER JOIN driver d on rd.driverId = d.idDriver
              INNER JOIN user ud on d.userId = ud.idUser
            WHERE rd.driverId = :driverId AND rd.statusId = :status
        ";

        $bind = [
            ':driverId' => $driverId,
            ':status' => Status::ATIVO,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    public function getAllCustomersBlockedMe(int $idDriver)
    {
        $sql = /** @lang sql */"
        SELECT
            c.idCustomer,
            u.name
        FROM {$this->table} rD
            INNER JOIN customer c ON rD.customerId = c.idCustomer
            INNER JOIN user u ON c.userId = u.idUser
        WHERE rD.driverId = :driverId AND rD.statusId = :status
    ";

        $bind = [
            ':driverId' => $idDriver,
            ':status' => Status::ATIVO,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    /**
     * Retorna um registro de motorista bloqueado pelo id (refusedDriver)
     * @param int $idRefused
     * @return object|null
     */
    public function findById($idRefused)
    {
        $sql = "
            SELECT *
            FROM {$this->table}
            WHERE id = :idRefused
            LIMIT 1
        ";
        $bind = [
            ':idRefused' => $idRefused
        ];
        return $this->sqlRawSelect($sql, $bind)->get(false);
    }

}