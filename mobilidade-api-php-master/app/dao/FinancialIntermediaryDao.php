<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/11/2019
 * Time: 14:16
 */
class FinancialIntermediaryDao extends BaseDao
{
    protected $table = "financialIntermediary";

    public function findActive()
    {
        $sql = "
            SELECT
                *
            FROM {$this->table} fi
              WHERE fi.active = 1
              LIMIT 1
        ";

        return $this->sqlRawSelect($sql)
            ->get(false);
    }

    public function findActiveByCity(int $cityId)
    {
        $sql = "
            select fi.*
            from {$this->table} fi
                     inner join acquirerMetaData amd on fi.idFinancialIntermediary = amd.financialIntermediaryId
                     inner join acquirerMetaDataCity amdc
                               on amd.id = amdc.acquirerMetaDataId and amdc.cityId = :cityId and amdc.active = 1 and amdc.deleted_at is null 
            limit 1;
        ";

        return $this->sqlRawSelect($sql, [':cityId' => $cityId])
            ->get(false);
    }

    public function find($id)
    {
        return $this->sqlSelect([], [
            ['financialIntermediary.idFinancialIntermediary', '=', ':idFinancialIntermediary']
        ])
            ->bind([':idFinancialIntermediary' => $id])
            ->get(false);
    }

}