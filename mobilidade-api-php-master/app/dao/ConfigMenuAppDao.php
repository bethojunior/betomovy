<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 14/08/2018
 * Time: 13:59
 */
class ConfigMenuAppDao extends BaseDao
{
    public $table = 'configMenuApp';
    public function findPermissions(array $keys)
    {
        $where = [];
        $bind = [];

        foreach ($keys as $index => $key) {
            $where[] = end($keys) == $key ?
                ['configMenuApp.key', '=', ':key' . $index] :
                ['configMenuApp.key', '=', ':key' . $index, 'OR'];
            $bind += [':key' . $index => $key];
        }

        return $this->sqlSelect(['configMenuApp.key', 'value', 'configTypeId', 'description'], $where)
            ->bind($bind)
            ->get();
    }
}