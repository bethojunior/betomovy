<?php

namespace app\dao;

use app\constant\CancellationReasonsTypeConst;
use app\utils\BaseDao;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 08/08/2018
 * Time: 14:19
 */
class CancellationReasonsDao extends BaseDao
{
    protected $table = "cancellationReasons";

    public function getActives()
    {
        return $this->sqlSelect([], [
            ['statusId', '=', ':statusId', 'AND'],
            ['reports', '=', ':reports', 'AND'],
            ['(cancellationReasonsTypeId', 'IS', 'NULL', 'OR'],
            ['cancellationReasonsTypeId', '=', ':cancellationReasonsTypeId)']
        ])
            ->bind([
                ':statusId' => Status::ATIVO,
                ':cancellationReasonsTypeId' => CancellationReasonsTypeConst::DRIVER,
                ':reports' => 0
            ])
            ->get();
    }

    public function getCustomersActives()
    {
        return $this->sqlSelect([], [
            ['statusId', '=', ':statusId', 'AND'],
            ['reports', '=', ':reports', 'AND'],
            ['cancellationReasonsTypeId', '=', ':cancellationReasonsTypeId']
        ])
            ->bind([
                ':statusId' => Status::ATIVO,
                ':cancellationReasonsTypeId' => CancellationReasonsTypeConst::CUSTOMER,
                ':reports' => 0
            ])
            ->get();
    }

    public function find(int $id)
    {
        return $this->sqlSelect([], [
            ['idCancellationReasons', '=', ':idCancellationReasons'],
        ])
            ->bind([
                ':idCancellationReasons' => $id
            ])
            ->first();
    }

    public function getReportsActives()
    {
        return $this->sqlSelect([], [
            ['statusId', '=', ':statusId', 'AND'],
            ['cancellationReasonsTypeId', '=', ':cancellationReasonsTypeId', 'AND'],
            ['reports', '=', ':statusId']
        ])
            ->bind([
                ':statusId' => Status::ATIVO,
                ':cancellationReasonsTypeId' => CancellationReasonsTypeConst::CUSTOMER,
                ':reports' => Status::ATIVO
            ])
            ->get();
    }
}