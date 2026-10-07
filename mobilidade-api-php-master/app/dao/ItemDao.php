<?php

namespace app\dao;

use app\utils\BaseDao;
use app\utils\PDOPagination;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 27/07/2019
 * Time: 10:38
 */
class ItemDao extends BaseDao
{
    protected $table = 'items';

    public function all($page = null, $description = null)
    {
        $sql = "
            SELECT
                *
            FROM  {$this->table} i
              WHERE i.statusId = :statusId
        ";

        $bind = [
            ':statusId' => Status::ATIVO
        ];

        if ($description) {
            $sql .= " AND i.description LIKE '%{$description}%'";
        }

        $paginator = new PDOPagination($sql, $bind);

        return $paginator
            ->paginate($page ?? 1, 15);
    }
}