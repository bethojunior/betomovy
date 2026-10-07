<?php

namespace app\dao;

use app\utils\BaseDao;
use app\model\Status;
use app\utils\Connection;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 27/08/2019
 * Time: 15:59
 */
class TripTypeDao extends BaseDao
{
    protected $table = "tripType";

    public function __construct($conn = null, string $dbtype = Connection::DB_MYSQL_RO)
    {
        parent::__construct($conn, $dbtype);
    }

    public function find($id)
    {
        return $this->sqlSelect([], [
            ['idTripType', '=', ':tripTypeId']
        ])
            ->bind([':tripTypeId' => $id])
            ->get(false);
    }

    public function findById($id)
    {
        return $this->sqlRawSelect("
            SELECT
                idTripType,
                type,
                tt.description,
                CONCAT(c.value, 'tripType/', tt.picture) AS picture,
                returnOption,
                deliveryOption,
                freightOption,
                onlyCentral,
                openPrice,
                offerOption,
                serviceOption,
                tt.loopingOption,
                tt.scheduledOnlyOption
            FROM tripType tt
                INNER JOIN config c ON c.`key` = 'link_storage_pictures'
                WHERE tt.idTripType = :idTripType
        ", [':idTripType' => $id])
            ->first();
    }

    public function getActives()
    {
        return $this->sqlRawSelect("
            SELECT
                idTripType,
                type,
                description,
                picture,
                deliveryOption,
                freightOption
            FROM tripType tt
              WHERE tt.statusId = 1
            ORDER BY tt.order
        ")
            ->get();
    }

    public function findByLocale($lat, $lng)
    {
        $sql = "
            SELECT
                DISTINCT(tt.idTripType) AS tripTypeId,
                tt.type AS name,
                tt.description,
                tt.picture,
                tt.freightOption,
                tt.onlyCentral,
                tt.openPrice
            FROM {$this->table} tt
                INNER JOIN price p ON p.tripTypeId = tt.idTripType
                INNER JOIN city c on p.cityId = c.id
                INNER JOIN cityArea ca on (c.id = ca.cityId AND ca.statusId = :statusActive)
            WHERE 
                ST_Contains(
                  ca.polygon,
                  ST_GeomFromText(CONCAT('POINT(', :lat, ' ', :lng, ')'))
                ) = 1 AND
                tt.statusId = :statusActive AND
                p.statusId = :statusActive
        ";

        $bind = [
            ':lat' => $lat,
            ':lng' => $lng,
            ':statusActive' => Status::ATIVO
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }
}