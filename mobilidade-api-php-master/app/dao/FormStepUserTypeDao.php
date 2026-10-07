<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 29/01/2020
 * Time: 16:13
 */
class FormStepUserTypeDao extends BaseDao
{
    protected $table = "formStepUserType";

    public function findByUserType($userTypeId)
    {
        $sql = "
            SELECT
                fsut.*,
                fs.step,
                fs.description
            FROM {$this->table} fsut
                INNER JOIN formStep fs ON fsut.formStepId = fs.id
                WHERE 
                    fsut.statusId = :status AND 
                    fsut.userTypeId = :userTypeId
        ";

        $bind = [
            ':status' => Status::ATIVO,
            ':userTypeId' => $userTypeId,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }
}