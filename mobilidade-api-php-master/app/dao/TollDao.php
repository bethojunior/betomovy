<?php

namespace app\dao;

use app\utils\BaseDao;
use app\utils\Connection;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/08/2020
 * Time: 10:13
 */

// Read-Only Class
class TollDao extends BaseDao
{
    protected $table = 'toll';

    public function __construct($conn = null, string $dbtype = Connection::DB_MYSQL_RO)
    {
        parent::__construct($conn, $dbtype);
    }

    public function findByLinestring(string $lineString)
    {
        $sql = "
            SELECT
                t.id,
                t.name,
                t.address,
                t.value,
                t.active
            FROM {$this->table} t
                WHERE 
                    t.active = 1 AND
                    t.deleted_at IS NULL AND
                    ST_Crosses(ST_GeomFromText('{$lineString}'), t.polygon) = 1";

        return $this->sqlRawSelect($sql)
            ->get();
    }
}