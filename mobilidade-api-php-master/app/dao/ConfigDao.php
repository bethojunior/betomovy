<?php

namespace app\dao;

use app\utils\BaseDao;
use app\utils\Connection;

/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 14/08/2018
 * Time: 13:59
 */

// Read-Only Class
class ConfigDao extends BaseDao
{
    public function __construct($conn = null, string $dbtype = Connection::DB_MYSQL_RO)
    {
        parent::__construct($conn, $dbtype);
    }

    public function findMany(array $keys)
    {
        $where = [];
        $bind = [];

        foreach ($keys as $index => $key) {
            $where[] = end($keys) == $key ?
                ['config.key', '=', ':key' . $index] :
                ['config.key', '=', ':key' . $index, 'OR'];
            $bind += [':key' . $index => $key];
        }

        return $this->sqlSelect(['config.key', 'value'], $where)
            ->bind($bind)
            ->get();
    }

    public function findByKey(string $key)
    {
        return $this->sqlSelect(['config.key', 'value'], [['config.key', '=', ':key']])
            ->bind([':key' => $key])
            ->first();
    }
}