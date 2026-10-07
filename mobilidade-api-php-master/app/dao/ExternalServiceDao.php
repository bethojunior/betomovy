<?php


namespace app\dao;

use app\utils\BaseDao;

class ExternalServiceDao extends BaseDao
{
    protected $table = 'externalService';

    public function findActiveByType(int $externalServiceTypeId)
    {
        $sql = "
            SELECT
                *
            FROM {$this->table} es
                WHERE es.externalServiceTypeId = :externalServiceTypeId
                AND es.active = 1;
        ";

        $bind = [':externalServiceTypeId' => $externalServiceTypeId];

        return $this->sqlRawSelect($sql, $bind)
            ->first();
    }

    public function findActiveByTypeAndCity(int $externalServiceTypeId, int $cityId)
    {
        $sql = "
            SELECT distinct es.*
            FROM externalService es
                     inner join externalServiceMetaData esmd on es.id = esmd.externalServiceId
                     inner join externalServiceMetaDataCity esmdc on (
                    esmdc.statusId = 1 and
                    esmd.id = esmdc.externalServiceMetaDataId and
                    esmdc.cityId = :cityId)
            WHERE es.externalServiceTypeId = :externalServiceTypeId
            limit 1;
        ";

        $bind = [
            ':externalServiceTypeId' => $externalServiceTypeId,
            ':cityId' => $cityId
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->first();
    }
}