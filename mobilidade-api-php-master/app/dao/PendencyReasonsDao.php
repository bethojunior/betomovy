<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\PendencyReasonsType;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/09/2018
 * Time: 09:16
 */
class PendencyReasonsDao extends BaseDao
{
    protected $table = 'pendencyReasons';

    /**
     * @param $driverId
     * @return array|mixed
     */
    public function getByDriver($driverId)
    {
        $pendencyReasonsTypeTable = (new PendencyReasonsType)->getTableName();

        $pendencies = $this->sqlRawSelect("
            SELECT
                {$this->table}.idPendencyReasons,
                {$this->table}.pendencyReasonsTypeId,
                {$pendencyReasonsTypeTable}.name AS type,
                {$this->table}.date
            FROM {$this->table}
              INNER JOIN {$pendencyReasonsTypeTable} ON {$this->table}.pendencyReasonsTypeId = {$pendencyReasonsTypeTable}.idPendencyReasonsType
            WHERE driverId = :driverId AND statusId = :statusId
        ", [
            ':driverId' => $driverId,
            ':statusId' => Status::ATIVO
        ])
            ->get();

        return $pendencies;
    }
}