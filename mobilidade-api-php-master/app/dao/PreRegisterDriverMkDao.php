<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/01/2019
 * Time: 12:09
 */
class PreRegisterDriverMkDao extends BaseDao
{
    protected $table = 'preRegisterDriverMk';

    public function getAll()
    {
        return $this->sqlSelect()->get();
    }
}