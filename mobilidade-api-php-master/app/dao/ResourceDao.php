<?php

namespace app\dao;

use app\model\Resource;
use app\utils\BaseDao;
use app\utils\Connection;

class ResourceDao extends BaseDao
{
    protected $table = "resource";

    public function find(int $id, array $columns = [])
    {
        return $this->sqlSelect($columns, [['id', '=', $id]])->first();
    }

    public function delete(int $id)
    {
        return $this->sqlDelete(['id', '=', $id]);
    }

    public function findOrFail(int $id, array $columns = [])
    {
        $resource = $this->sqlSelect($columns, [['id', '=', $id]])->first();
        if (!$resource) {
            throw new \Exception("Resource not found for id {$id}");
        }
        return $resource;
    }
}
