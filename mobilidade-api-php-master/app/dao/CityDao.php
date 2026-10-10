<?php

namespace app\dao;

use app\utils\BaseDao;
use app\utils\Connection;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 18/07/2018
 * Time: 14:16
 */

// Read-Only Class
class CityDao extends BaseDao
{
    public function __construct($conn = null, string $dbtype = Connection::DB_MYSQL_RO)
    {
        parent::__construct($conn, $dbtype);
    }

    public function find(int $id, array $columns = [])
    {
        return $this->sqlSelect($columns, [
            ['id', '=', $id]
        ])
            ->first();
    }

    public function getByEstate($estate)
    {
        if (empty($estate))
            return $this->sqlSelect([], [], ['nome', 'ASC'])->get();

        return $this->sqlSelect([], [['estado', '=', $estate]], ['nome', 'ASC'])->get();
    }

    public function findByCoordinate($latitude, $longitude)
    {
        try {
            $sql = /** @lang sql */ "
                SELECT
                    c.*
                FROM {$this->table} c
                  INNER JOIN cityArea ca ON c.id = ca.cityId
                  WHERE
                    ca.statusId = 1 AND
                    ST_CONTAINS(ca.polygon, ST_GeomFromText('POINT({$latitude} {$longitude})'))
                LIMIT 1
            ";

            $res = $this->sqlRawSelect($sql)
                ->get(false);
            if (!empty($res)) {
                return $res;
            }
        } catch (\Throwable $e) {
        }

        try {
            return $this->sqlSelect([], [['active', '=', 1]], ['id', 'ASC'])->first();
        } catch (\Throwable $e) {
            return $this->sqlSelect([], [], ['id', 'ASC'])->first();
        }
    }

    public function findActives()
    {
        try {
            $sql = /** @lang sql */ "
                SELECT
                    city.*
                FROM {$this->table} city
                  INNER JOIN cityArea ca ON (city.id = ca.cityId AND ca.statusId = 1)
                ORDER BY city.nome;
            ";

            $res = $this->sqlRawSelect($sql)->get();
            if (!empty($res)) {
                return $res;
            }
        } catch (\Throwable $e) {
        }

        try {
            $res = $this->sqlSelect([], [['active', '=', 1]], ['nome', 'ASC'])->get();
            if (!empty($res)) {
                return $res;
            }
        } catch (\Throwable $e) {
        }

        try {
            return $this->sqlSelect([], [], ['nome', 'ASC'])->get();
        } catch (\Throwable $e) {
            return [];
        }
    }
}