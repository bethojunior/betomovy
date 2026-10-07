<?php


namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;
use app\utils\Connection;

// Read-Only Class
class MapServiceMetaDataDao extends BaseDao
{
    public $table = "mapServiceMetaData";

    public function __construct($conn = null, string $dbtype = Connection::DB_MYSQL_RO)
    {
        parent::__construct($conn, $dbtype);
    }

    public function findByCity(string $key, int $cityId)
    {
        $sql = "
            select msmdc.id,
                   msmd.`key`,
                   msmdc.value,
                   msmd.mapServiceId,
                   msmd.description
            from mapServiceMetaData msmd
                     inner join mapServiceMetaDataCity msmdc
                                on msmd.id = msmdc.mapServiceMetaDataId
            where msmd.`key` = :key
              and msmdc.statusId = 1
              and msmdc.groupCode is not null
              and msmdc.cityId = :cityId";

        return $this
            ->sqlRawSelect($sql,
                [
                    ':key' => $key,
                    ':cityId' => $cityId
                ]
            )
            ->get();
    }

    public function findByMapServiceAndCity(int $mapServiceId, int $cityId)
    {
        $sql = "
            select msmdc.id,
                   msmd.`key`,
                   msmdc.value,
                   msmd.mapServiceId,
                   msmd.description,
                   msmdc.groupCode
            from mapServiceMetaData msmd
                     inner join mapServiceMetaDataCity msmdc
                                on msmd.id = msmdc.mapServiceMetaDataId
            where msmd.mapServiceId = :mapServiceId
              and msmdc.statusId = 1
              and msmdc.cityId = :cityId
              and msmdc.groupCode is not null
            order by msmdc.groupCode";

        return $this
            ->sqlRawSelect($sql,
                [
                    ':mapServiceId' => $mapServiceId,
                    ':cityId' => $cityId
                ]
            )
            ->get();
    }


    public function findManyByCity(array $keys, int $cityId)
    {
        $bind = [':cityId' => $cityId];
        $sql = "
            select msmd.`key`,
                   msmdc.value as value
            from {$this->table} msmd
                     inner join mapServiceMetaDataCity msmdc
                                on msmd.id = msmdc.mapServiceMetaDataId and msmdc.statusId = 1 and msmdc.cityId = :cityId
            where msmd.`key` in (";

        foreach ($keys as $index => $key) {
            $sql .= end($keys) == $key ? ':key' . $index . ');' : ':key' . $index . ', ';
            $bind += [':key' . $index => $key];
        }

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    public function existKeyByCity($cityId)
    {
        return $this->sqlRawSelect("SELECT * FROM mapServiceMetaDataCity WHERE cityId = :cityId AND statusId = :statusId LIMIT 1", [
                ":cityId" => $cityId,
                ":statusId" => Status::ATIVO
            ])->first() != null;
    }
}