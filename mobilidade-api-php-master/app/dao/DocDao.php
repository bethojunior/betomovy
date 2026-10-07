<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 26/08/2020
 * Time: 11:45
 */
class DocDao extends BaseDao
{
    protected $table = 'doc';

    public function findAll()
    {
        return $this->sqlSelect([], [
            ['statusId', '=', ':statusId']
        ])
            ->bind([':statusId' => Status::ATIVO])
            ->get();
    }
}