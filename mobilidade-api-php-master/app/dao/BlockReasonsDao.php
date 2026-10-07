<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\BlockReasonsType;
use app\model\Status;

/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 27/08/2018
 * Time: 18:02
 */
class BlockReasonsDao extends BaseDao
{
    protected $table = "blockReasons";

    /**
     * @param $driverId
     * @return array|mixed
     */
    public function getByDriver($driverId)
    {
        $blockReasonsTypeTable = (new BlockReasonsType)->getTableName();

        $blocks = $this->sqlRawSelect("
            SELECT
                {$this->table}.idBlockReasons,
                {$this->table}.blockReasonsTypeId,
                {$blockReasonsTypeTable}.name AS type,
                {$this->table}.date
            FROM {$this->table}
              INNER JOIN {$blockReasonsTypeTable} ON {$this->table}.blockReasonsTypeId = {$blockReasonsTypeTable}.idBlockReasonsType
            WHERE driverId = :driverId AND statusId = :statusId
        ", [
            ':driverId' => $driverId,
            ':statusId' => Status::ATIVO
        ])
            ->get();

        return $blocks;
    }
}