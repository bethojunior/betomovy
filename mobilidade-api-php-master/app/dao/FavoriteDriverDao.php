<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;
use Exception;

/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 12/12/2018
 * Time: 17:43
 */
class FavoriteDriverDao extends BaseDao
{
    protected $table = "favoriteDriver";

    public function getAll($customerId)
    {
        $sql = "
            SELECT
                fd.idFavorite,
                d.idDriver,
                d.status AS statusDriver,
                ud.name AS driverName,
                ud.nickname AS driverNickname,
                d.profileImage AS driverImage,
                c.plate,
                (SELECT
                    JSON_ARRAYAGG(
                        JSON_OBJECT('tripTypeId', tT.idTripType, 'name', tT.type)
                    )
                FROM tripTypeDriver ttd
                    INNER JOIN userType uT on ttd.userTypeId = uT.idUserType
                    INNER JOIN tripType tT on ttd.tripTypeId = tT.idTripType
                    WHERE
                          ttd.userTypeId = lA.userTypeId
                    GROUP BY ttd.userTypeId) AS tripTypes
            FROM {$this->table} fd
              INNER JOIN driver d on fd.driverId = d.idDriver
              INNER JOIN user ud on d.userId = ud.idUser
              INNER JOIN levelAccess lA on ud.idUser = lA.userId
              LEFT JOIN car c on d.idDriver = c.driverId
            WHERE fd.customerId = :customerId
              AND fd.status = :status
              AND (c.pending = 0 OR c.pending IS NULL)
              AND c.deleted_at IS NULL;
        ";

        $bind = [
            ':customerId' => $customerId,
            ':status' => Status::ATIVO,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    public function getAllByDriver($driverId, $count = false, $limit = null)
    {
        $select = ['fd.idFavorite', 'c.idCustomer', 'uc.name', 'uc.nickname', 'fd.created_at', 'c.profileImage'];

        if ($count)
            $select = ['COUNT(*) AS totalRows'];

        $limit = $limit ? " LIMIT {$limit}" : " ";

        $sql = "
            SELECT
                " . implode(',', $select) . "
            FROM {$this->table} fd
              INNER JOIN customer c on fd.customerId = c.idCustomer
              INNER JOIN user uc on c.userId = uc.idUser
            WHERE fd.driverId = :driverId AND fd.status = :status
                ORDER BY fd.created_at DESC
            {$limit}
        ";

        $bind = [
            ':driverId' => $driverId,
            ':status' => Status::ATIVO,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(!$count);
    }

    /**
     * @param $idFavorite
     * @return bool
     * @throws Exception
     */
    public function delete($idFavorite)
    {
        return $this->sqlUpdate(
            ['status' => ':status'],
            [['idFavorite', '=', ':idFavorite']],
            [':status' => Status::EXCLUIDO, ':idFavorite' => $idFavorite]
        );
    }
}