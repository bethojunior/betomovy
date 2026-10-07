<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\LevelAccess;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 11/07/2018
 * Time: 11:44
 */
class LevelAccessDao extends BaseDao
{
    protected $table = "levelAccess";

    /**
     * @param $userId
     * @param $userType
     * @return string
     */
    public function createNew($userId, $userType)
    {
        $levelAccess = new LevelAccess;
        $levelAccess->setUserId($userId);
        $levelAccess->setUserTypeId($userType);

        return $this->sqlInsert($levelAccess);
    }

    public function getType($userId)
    {
        $sql = "
            SELECT
              la.userId,
              la.userTypeId,
              ut.name AS type,
              ut.isDriver
            FROM {$this->table} la
              INNER JOIN userType ut ON ut.idUserType = la.userTypeId
              WHERE 
                la.userId = :userId
        ";

        $bind = [
            ":userId" => $userId
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }
}