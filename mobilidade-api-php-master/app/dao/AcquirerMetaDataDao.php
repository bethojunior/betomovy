<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/11/2019
 * Time: 14:03
 */
class AcquirerMetaDataDao extends BaseDao
{
    protected $table = "acquirerMetaData";

    public function find(string $key)
    {
        return $this->sqlSelect([], [
            ['acquirerMetaData.key', '=', ':key']
        ])
            ->bind([':key' => $key])
            ->get(false);
    }

    public function findIdAquirer(int $id)
    {
        return $this->sqlSelect([], [
            ['acquirerMetaData.financialIntermediaryId', '=', ':id']
        ])
            ->bind([':id' => $id])
            ->get(false);
    }

    public function findByCity(string $key, int $cityId)
    {
        $sql = /** @lang sql */ "
            select amd.id,
                   amd.`key`,
                   coalesce(amdc.value, amd.value) as value,
                   amd.financialIntermediaryId,
                   amd.showable,
                   amd.description
            from acquirerMetaData amd
                     left join acquirerMetaDataCity amdc
                               on amd.id = amdc.acquirerMetaDataId and amdc.active = 1 and amdc.cityId = :cityId
            where amd.`key` = :key;
        ";

        return $this->sqlRawSelect($sql, [
            ':key' => $key,
            ':cityId' => $cityId
        ])
            ->get(false);
    }

    public function findMany(array $keys)
    {
        $where = [];
        $bind = [];

        foreach ($keys as $index => $key) {
            $where[] = end($keys) == $key ?
                ['acquirerMetaData.key', '=', ':key' . $index] :
                ['acquirerMetaData.key', '=', ':key' . $index, 'OR'];
            $bind += [':key' . $index => $key];
        }

        return $this->sqlSelect(['acquirerMetaData.key', 'value'], $where)
            ->bind($bind)
            ->get();
    }

    public function findManyByCity(array $keys, int $cityId)
    {
        $bind = [':cityId' => $cityId];
        $sql = /** @lang sql */ "
            select amd.`key`,
                   coalesce(amdc.value, amd.value) as value
            from acquirerMetaData amd
                     left join acquirerMetaDataCity amdc
                                on (amd.id = amdc.acquirerMetaDataId and amdc.active = 1 and amdc.cityId = :cityId)
            where amd.`key` in (";

        foreach ($keys as $index => $key) {
            $sql .= end($keys) == $key ? ':key' . $index . ');' : ':key' . $index . ', ';
            $bind += [':key' . $index => $key];
        }

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    public function getCityValuesForAcquirer(int $acquirerId)
    {
        $sql = "
            SELECT
                amc.value
            FROM acquirerMetaDataCity amc
            WHERE acquirerMetaDataId = :acquirerId
        ";
        $bind = [":acquirerId" => $acquirerId];
        return $this->sqlRawSelect($sql, $bind)->get();
    }

    public function findByAcquirerId(int $acquirerId)
    {
        return $this->sqlSelect(["acquirerMetaData.key", "acquirerMetaData.value"], [
            ['acquirerMetaData.financialIntermediaryId', '=', ':id']
        ])
            ->bind([':id' => $acquirerId])
            ->get();
    }

    public function findByCityId(int $acquirerId, int $cityId)
    {
        $sql = "
            SELECT
                COALESCE(amdc.value, amd.value) as value,
                amd.key
            FROM acquirerMetaData amd
            LEFT JOIN acquirerMetaDataCity amdc 
                ON amdc.acquirerMetaDataId = amd.id 
                AND amdc.cityId = :cityId 
                AND amdc.active = 1
            WHERE amd.financialIntermediaryId = :acquirerId
        ";

        $bind = [":acquirerId" => $acquirerId, ":cityId" => $cityId];

        return $this->sqlRawSelect($sql, $bind)->get();
    }
}