<?php

namespace app\dao;

use app\utils\BaseDao;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 31/03/2020
 * Time: 11:55
 */
class ExternalServiceMetaDataDao extends BaseDao
{
    protected $table = "externalServiceMetaData";

    public function find(string $key)
    {
        return $this->sqlSelect([], [
            ['externalServiceMetaData.key', '=', ':key']
        ])
            ->bind([':key' => $key])
            ->first();
    }

    public function findByCity(string $key, int $cityId)
    {
        return $this->sqlRawSelect("
            select `key`,
                   if(esmdc.value is not null, esmdc.value, esmd.value) as value,
                   cityId
            from externalServiceMetaData esmd
                     left join externalServiceMetaDataCity esmdc
                               on (esmd.id = esmdc.externalServiceMetaDataId and cityId = :cityId and statusId = 1)
            where `key` = :key;
        ", [
            ':key' => $key,
            ':cityId' => $cityId
        ])
            ->first();
    }

    public function findMany(array $keys)
    {
        $where = [];
        $bind = [];

        foreach ($keys as $index => $key) {
            $where[] = end($keys) == $key ?
                ['externalServiceMetaData.key', '=', ':key' . $index] :
                ['externalServiceMetaData.key', '=', ':key' . $index, 'OR'];
            $bind += [':key' . $index => $key];
        }

        return $this->sqlSelect(['externalServiceMetaData.key', 'value'], $where)
            ->bind($bind)
            ->get();
    }
}