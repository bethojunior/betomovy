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
        try {
            $row = $this->sqlRawSelect("
                SELECT
                    tt.idTripType,
                    tt.type,
                    COALESCE(tt.name, tt.type) AS name,
                    tt.description,
                    CONCAT(COALESCE(c.value, ''), 'tripType/', COALESCE(tt.picture, '')) AS picture,
                    COALESCE(tt.returnOption, 0) as returnOption,
                    COALESCE(tt.deliveryOption, 0) as deliveryOption,
                    COALESCE(tt.freightOption, 0) as freightOption,
                    COALESCE(tt.onlyCentral, 0) as onlyCentral,
                    COALESCE(tt.openPrice, 0) as openPrice,
                    COALESCE(tt.offerOption, 0) as offerOption,
                    COALESCE(tt.serviceOption, 0) as serviceOption,
                    COALESCE(tt.loopingOption, 0) as loopingOption,
                    COALESCE(tt.scheduledOnlyOption, 0) as scheduledOnlyOption
                FROM tripType tt
                LEFT JOIN config c ON c.`key` = 'link_storage_pictures'
                WHERE tt.idTripType = :idTripType
            ", [':idTripType' => $id])
                ->first();

            if ($row) {
                return $row;
            }
        } catch (\Throwable $t) {
        }

        try {
            return $this->sqlRawSelect("
                SELECT
                    tt.idTripType,
                    tt.type,
                    COALESCE(tt.name, tt.type) AS name,
                    tt.description,
                    tt.picture,
                    COALESCE(tt.returnOption, 0) as returnOption,
                    COALESCE(tt.deliveryOption, 0) as deliveryOption,
                    COALESCE(tt.freightOption, 0) as freightOption,
                    COALESCE(tt.onlyCentral, 0) as onlyCentral,
                    COALESCE(tt.openPrice, 0) as openPrice,
                    COALESCE(tt.offerOption, 0) as offerOption,
                    COALESCE(tt.serviceOption, 0) as serviceOption,
                    0 as loopingOption,
                    0 as scheduledOnlyOption
                FROM tripType tt
                WHERE tt.idTripType = :idTripType
            ", [':idTripType' => $id])
                ->first();
        } catch (\Throwable $t2) {
            return null;
        }
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