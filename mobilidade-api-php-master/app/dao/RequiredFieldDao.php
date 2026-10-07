<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 07/08/2019
 * Time: 10:50
 */
class RequiredFieldDao extends BaseDao
{
    protected $table = "requiredField";

    public function findByUserType($userTypeId, bool $fullFields = false)
    {
        $where = $fullFields ? '' : ' AND rf.required = 1';

        return $this->sqlRawSelect("
            SELECT
                rf.*
            FROM {$this->table} rf
              WHERE 
                rf.userTypeId = :userTypeId
                {$where}
        ", [
            ':userTypeId' => $userTypeId
        ])
            ->get();
    }
}