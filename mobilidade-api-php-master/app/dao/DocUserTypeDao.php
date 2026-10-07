<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 25/01/2020
 * Time: 09:40
 */
class DocUserTypeDao extends BaseDao
{
    protected $table = 'docUserType';

    public function findByUserType($userTypeId)
    {
        $sql = "
            SELECT
                dut.id AS docUserTypeId,
                dut.docId,
                d.label,
                d.description,
                d.image,
                d.text,
                d.pdf,
                d.link
            FROM {$this->table} dut
                INNER JOIN doc d ON dut.docId = d.id
                WHERE 
                    dut.statusId = :statusActive AND
                    d.statusId = :statusActive AND
                    dut.userTypeId = :userTypeId
        ";

        $bind = [
            ':statusActive' => Status::ATIVO,
            ':userTypeId' => $userTypeId,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }
}