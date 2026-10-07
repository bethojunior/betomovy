<?php

namespace app\dao;

use app\exceptions\PriceException;
use app\utils\BaseDao;
use app\utils\Connection;
use Exception;
use app\model\Location;
use app\model\Price;
use app\model\Status;
use app\model\TripType;

/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 11/09/2018
 * Time: 14:48
 */

// Read-Only Class
class PriceDao extends BaseDao
{

    public function __construct($conn = null, string $dbtype = Connection::DB_MYSQL_RO)
    {
        parent::__construct($conn, $dbtype);
    }

    /**
     * @param $tripTypeId
     * @param $cityId
     * @return Price
     * @throws Exception
     */
    public function find($tripTypeId, $cityId): Price
    {
        $tripTypeTable = (new TripType)->getTableName();

        $sql = "
            SELECT
                p.id,
                p.min_price,
                p.base_price,
                p.km_price,
                p.minute_price,
                tt.type AS name,
                tt.description,
                tt.picture,
                p.tripTypeId,
                p.cityId,
                p.tax_price,
                p.another_fee,
                p.waypoint_price,
                p.long_distance_delivery_price,
                p.statusId,
                p.reward_driver_min_price,
                p.type_additional_value_after_km,
                p.additional_value_after_km,
                p.km_to_additional_value,
                p.promotional_price_temp,
                p.long_distance_per_km,
                p.long_distance_value_to_final_price,
                p.long_distance_radius,
                p.tag,
                p.color,
                p.idealListCommonPrice
            FROM {$this->table} p
              INNER JOIN {$tripTypeTable} tt ON p.tripTypeId = tt.idTripType
            WHERE p.cityId = :cityId AND p.tripTypeId = :tripTypeId AND p.statusId = :statusId
        ";

        $price = $this->sqlRawSelect($sql, [
            ':cityId' => $cityId,
            ':tripTypeId' => $tripTypeId,
            ':statusId' => Status::ATIVO
        ])
            ->get(false);

        if (!$price)
            throw new PriceException(100);

        return new Price($price);
    }

    /**
     * @param $id
     * @return Price
     * @throws PriceException
     */
    public function findById($id)
    {
        $tripTypeTable = (new TripType)->getTableName();

        $sql = "
            SELECT
                p.id,
                p.min_price,
                p.base_price,
                p.km_price,
                p.minute_price,
                tt.type AS name,
                tt.description,
                tt.picture,
                p.tripTypeId,
                p.cityId,
                p.tax_price,
                p.tax_price_type,
                if(p.tax_price_description is null or p.tax_price_description = '', 'Taxa 1', p.tax_price_description) as tax_price_description,
                p.another_fee,
                p.another_fee_type,
                if(p.another_fee_description is null or p.another_fee_description = '', 'Taxa 2', p.another_fee_description) as another_fee_description,
                p.waypoint_price,
                p.long_distance_delivery_price,
                p.statusId,
                p.reward_driver_min_price,
                p.type_additional_value_after_km,
                p.additional_value_after_km,
                p.km_to_additional_value,
                p.promotional_price_temp,
                p.long_distance_per_km,
                p.long_distance_value_to_final_price,
                p.long_distance_radius,
                p.tag,
                p.color,
                p.idealListCommonPrice,
                p.another_fee_type,
                p.tax_price_type
            FROM {$this->table} p
              INNER JOIN {$tripTypeTable} tt ON p.tripTypeId = tt.idTripType
            WHERE 
              p.id = :id
        ";

        $price = $this->sqlRawSelect($sql, [':id' => $id])
            ->get(false);

        if (!$price)
            throw new PriceException(100);

        return new Price($price);
    }

    /**
     * @param $tripReference
     * @return Price
     * @throws PriceException
     */
    public function findByTrip($tripReference)
    {
        $sql = "
            SELECT
                p.id,
                p.min_price,
                p.base_price,
                p.km_price,
                p.minute_price,
                p.tripTypeId,
                p.cityId,
                p.tax_price,
                p.another_fee,
                p.waypoint_price,
                p.long_distance_delivery_price,
                p.statusId,
                p.reward_driver_min_price,
                p.type_additional_value_after_km,
                p.additional_value_after_km,
                p.km_to_additional_value,
                p.promotional_price_temp,
                p.long_distance_per_km,
                p.long_distance_value_to_final_price,
                p.long_distance_radius,
                p.tag,
                p.color,
                p.idealListCommonPrice
            FROM trip t
              INNER JOIN {$this->table} p ON t.priceId = p.id
              INNER JOIN tripType tt ON p.tripTypeId = tt.idTripType
            WHERE 
              t.tripReference = :tripReference
        ";

        $price = $this->sqlRawSelect($sql, [':tripReference' => $tripReference])
            ->get(false);

        if (!$price)
            throw new PriceException(100);

        return new Price($price);
    }

    public function getAll()
    {
        $prices = $this->sqlSelect()
            ->get();

        return array_map(function ($price) {
            return new Price($price);
        }, $prices);
    }

    /**
     * @param $cityId
     * @return array
     * @throws PriceException
     */
    public function getByCity($cityId)
    {
        $tripTypeTable = (new TripType)->getTableName();

        $sql = "
            SELECT
                p.id,
                p.min_price,
                p.base_price,
                p.km_price,
                p.minute_price,
                tt.type AS name,
                tt.description,
                tt.picture,
                p.tripTypeId,
                p.cityId,
                p.tax_price,
                p.another_fee,
                p.waypoint_price,
                p.long_distance_delivery_price,
                p.statusId,
                p.reward_driver_min_price,
                p.type_additional_value_after_km,
                p.additional_value_after_km,
                p.km_to_additional_value,
                p.promotional_price_temp,
                p.long_distance_per_km,
                p.long_distance_value_to_final_price,
                p.long_distance_radius,
                p.tag,
                p.color,
                p.idealListCommonPrice
            FROM {$this->table} p
              INNER JOIN {$tripTypeTable} tt ON p.tripTypeId = tt.idTripType
            WHERE p.cityId = :cityId AND p.statusId = :statusId
              ORDER BY tt.order ASC
        ";

        $prices = $this->sqlRawSelect($sql, [
            'cityId' => $cityId,
            'statusId' => Status::ATIVO
        ])
            ->get();

        if (!$prices)
            throw new PriceException(100);

        return array_map(function ($price) {
            return new Price($price);
        }, $prices);
    }

    /**
     * @param Location $point
     * @param $distance
     * @param string|null $time
     * @param bool|null $onlyCentral
     * @param bool|null $noDestination
     * @return array|mixed
     */
    public function findByCityArea(
        Location $point, $distance = null, ?string $time = null, ?bool $onlyCentral = false, ?bool $noDestination = false)
    {
        $onlyCentralSql = $onlyCentral ?
            " AND tt.onlyCentral = 1" : "";

        if (is_null($onlyCentral))
            $onlyCentralSql = ' AND tt.onlyCentral = 0';

        $distanceSql = !is_null($distance) ?
            " AND (p.disable_after_km IS NULL OR p.disable_after_km = 0 OR p.disable_after_km >= :distance)
                AND cc.kmForCalculatePrice >= :distance" : "";

        $sql = "
            SELECT
                   p.id,
                   p.min_price,
                   p.base_price,
                   p.km_price,
                   p.minute_price,
                   tt.type AS name,
                   tt.description,
                   tt.picture,
                   tt.onlyCentral,
                   tt.deliveryOption,
                   tt.freightOption,
                   p.tripTypeId,
                   p.cityId,
                   p.tax_price,
                   p.tax_price_type,
                   p.another_fee,
                   p.another_fee_type,
                   p.waypoint_price,
                   p.long_distance_delivery_price,
                   p.statusId,
                   p.reward_driver_min_price,
                   p.type_additional_value_after_km,
                   p.additional_value_after_km,
                   p.km_to_additional_value,
                   p.promotional_price_temp,
                   p.tag,
                   p.color,
                   p.order,
                   ifnull(pds.multiplierValue,
                      IF(
                          GREATEST(
                                  IFNULL(pd.multiplierValue, 0),
                                  IFNULL(CASE WHEN p.idealListCommonPrice > 0 THEN multiplierByDriversClose(COUNT(cd.idDriver), p.idealListCommonPrice) ELSE 0 END, 0)
                              ) <= 0,
                          null,
                          GREATEST(
                                  IFNULL(pd.multiplierValue, 0),
                                  IFNULL(CASE WHEN p.idealListCommonPrice > 0 THEN multiplierByDriversClose(COUNT(cd.idDriver), p.idealListCommonPrice) ELSE 0 END, 0)
                              )
                      )
                   ) AS multiplierValue,
                   pds.tag AS dynamicTag,
                   cc.comparisionPrice,
                   cc.subtractionCompetitivePrice
            FROM price p
                   INNER JOIN city c on p.cityId = c.id
                   INNER JOIN cityArea ca on (c.id = ca.cityId AND ca.statusId = :statusActive)
                   INNER JOIN cityConfig cc on cc.cityId = c.id
                   INNER JOIN tripType tt on p.tripTypeId = tt.idTripType
                   LEFT JOIN (
                             SELECT
                                    cityId,
                                    tripTypeId,
                                    multiplierValue,
                                    tag
                             FROM priceDynamicScheduled
                             WHERE
                                 statusId = :statusActive AND
                                 (:now BETWEEN
                                     startDate AND endDate
                                     OR
                                :nowUTC between startDateUTC and endDateUTC)
                             GROUP BY tripTypeId, cityId ORDER BY endDate ASC
                             ) pds on (c.id = pds.cityId AND tt.idTripType = pds.tripTypeId)
                   LEFT JOIN (
                             SELECT priceDynamic.*
                             FROM priceDynamic
                             WHERE priceDynamic.statusId = :statusActive
                                  AND priceDynamic.active = :statusActive
                                  AND (
                                        ((TIME_FORMAT(:now, '%H:%i:%s') BETWEEN priceDynamic.timeStart AND priceDynamic.timeEnd) AND
                                         DAYOFWEEK(:now) = dayOfWeek)
                                        OR
                                        ((:nowUTC BETWEEN
                                            CONVERT_TZ(concat(date_format(:nowUTC, '%Y-%m-%d '), timeStart), timezone, '+00:00') AND
                                            CONVERT_TZ(concat(date_format(:nowUTC, '%Y-%m-%d '), timeEnd), timezone, '+00:00')) AND
                                         DAYOFWEEK(:nowUTC) = dayOfWeek)
                                    )
                             ) pd ON (c.id = pd.cityId AND tt.idTripType = pd.tripTypeId)
                   LEFT JOIN (
                             SELECT
                                    d.idDriver,
                                    GROUP_CONCAT(ttd.tripTypeId) AS tripTypes,
                                    ca.cityId
                             FROM driver d
                                    INNER JOIN levelAccess la on la.userId = d.userId
                                    INNER JOIN tripTypeDriver ttd ON ttd.userTypeId = la.userTypeId
                                    INNER JOIN cityArea ca on (
                                     ST_Contains (
                                       ca.polygon,
                                       ST_GeomFromText(CONCAT('POINT(', d.last_lat, ' ', d.last_lon, ')'))
                                         ) AND ca.statusId = :statusActive
                                     )
                                    INNER JOIN zone z on
                                     (ca.cityId = z.cityId AND z.statusId = :statusActive)
                             WHERE
                                 (6371 * acos(
                                           cos( radians(:latitude) )
                                             * cos( radians( d.last_lat ) )
                                             * cos( radians( d.last_lon ) - radians(:longitude) )
                                             + sin( radians(:latitude) )
                                                 * sin( radians( d.last_lat ) )
                                     )
                                     ) <= z.radius AND
                                 (d.status = 'disponivel' OR
                                  (d.status = 'corrida' AND
                                   d.preAvailable = :statusActive AND
                                   d.idDriver NOT IN (
                                                     SELECT pat.driverId
                                                     FROM pre_accepted_trips_view pat
                                                     ) AND
                                   d.idDriver IN (
                                                 SELECT trip.driverId
                                                 FROM trip
                                                 WHERE trip.status = 'in_progress'
                                                 )
                                      )) AND
                                 d.driverRegisterStatusId = :statusActive
                             GROUP BY d.idDriver
                             ) cd on FIND_IN_SET(p.tripTypeId, cd.tripTypes) > 0
            WHERE
                ST_Contains(
                  ca.polygon,
                  ST_GeomFromText(CONCAT('POINT(', :latitude, ' ', :longitude, ')'))
                    ) = 1 AND
                p.statusId = :statusActive AND
                tt.openPrice = :openPrice
                {$distanceSql}
                {$onlyCentralSql}
            GROUP BY p.id
            ORDER BY IF(cc.enableCustomOrderTripType = 1, p.order, tt.order) ASC
        ";

        $bind = [
            ':now' => $time ?? now(),
            ':nowUTC' => gmdate('Y-m-d H:i:s', strtotime($time ?? now())),
            ':latitude' => $point->getLatitude(),
            ':longitude' => $point->getLongitude(),
            ':statusActive' => Status::ATIVO,
            ':openPrice' => $noDestination ? 1 : 0,
        ];

        if (!is_null($distance))
            $bind[':distance'] = $distance;

        return $this->sqlRawSelect($sql, $bind)
            ->get();
    }

    /**
     * @param Location $point
     * @param $distance
     * @param $tripTypeId
     * @return array|mixed
     */
    public function findByCityAreaAndTripType(Location $point, $distance, $tripTypeId)
    {
        $sql = /** @lang sql */
            "
            SELECT
                   p.id,
                   p.min_price,
                   p.base_price,
                   p.km_price,
                   p.minute_price,
                   tt.type AS name,
                   tt.description,
                   tt.picture,
                   p.tripTypeId,
                   p.cityId,
                   p.tax_price,
                   p.tax_price_type,
                   p.another_fee,
                   p.another_fee_type,
                   p.waypoint_price,
                   p.long_distance_delivery_price,
                   p.statusId,
                   p.reward_driver_min_price,
                   p.type_additional_value_after_km,
                   p.additional_value_after_km,
                   p.km_to_additional_value,
                   p.promotional_price_temp,
                   p.tag,
                   p.color,
                   tt.deliveryOption,
                   tt.freightOption,
                   IF(
                     GREATEST(
                       IFNULL(pds.multiplierValue, 0),
                       IFNULL(pd.multiplierValue, 0),
                       IFNULL(CASE WHEN p.idealListCommonPrice > 0 THEN multiplierByDriversClose(COUNT(cd.idDriver), p.idealListCommonPrice) ELSE 0 END, 0)
                         ) <= 0,
                     null,
                     GREATEST(
                       IFNULL(pds.multiplierValue, 0),
                       IFNULL(pd.multiplierValue, 0),
                       IFNULL(CASE WHEN p.idealListCommonPrice > 0 THEN multiplierByDriversClose(COUNT(cd.idDriver), p.idealListCommonPrice) ELSE 0 END, 0)
                         )
                       ) AS multiplierValue,
                   pds.tag AS dynamicTag,
                   cc.comparisionPrice,
                   cc.subtractionCompetitivePrice
            FROM price p
                   INNER JOIN city c on p.cityId = c.id
                   INNER JOIN cityArea ca on (c.id = ca.cityId AND ca.statusId = :statusActive)
                   INNER JOIN cityConfig cc on cc.cityId = c.id
                   INNER JOIN tripType tt on p.tripTypeId = tt.idTripType
                   LEFT JOIN (
                             SELECT
                                    cityId,
                                    tripTypeId,
                                    multiplierValue,
                                    tag
                             FROM priceDynamicScheduled
                             WHERE
                                 statusId = :statusActive AND
                                 :now BETWEEN
                                     startDate AND endDate
                             GROUP BY tripTypeId, cityId ORDER BY endDate ASC
                             ) pds on (c.id = pds.cityId AND tt.idTripType = pds.tripTypeId)
                   LEFT JOIN (
                             SELECT
                                priceDynamic.*
                             FROM priceDynamic
                             WHERE
                                 priceDynamic.statusId = :statusActive AND
                                 priceDynamic.active = :statusActive AND
                                 (TIME_FORMAT(:now, '%H:%i:%s') BETWEEN priceDynamic.timeStart AND priceDynamic.timeEnd) AND
                                 DAYOFWEEK(:now) = dayOfWeek
                             ) pd ON (c.id = pd.cityId AND tt.idTripType = pd.tripTypeId)
                   LEFT JOIN (
                             SELECT
                                    d.idDriver,
                                    GROUP_CONCAT(ttd.tripTypeId) AS tripTypes,
                                    ca.cityId
                             FROM driver d
                                    INNER JOIN levelAccess la on la.userId = d.userId
                                    INNER JOIN tripTypeDriver ttd ON ttd.userTypeId = la.userTypeId
                                    INNER JOIN cityArea ca on (
                                     ST_Contains (
                                       ca.polygon,
                                       ST_GeomFromText(CONCAT('POINT(', d.last_lat, ' ', d.last_lon, ')'))
                                         ) AND ca.statusId = :statusActive
                                     )
                                    INNER JOIN zone z on
                                     (ca.cityId = z.cityId AND z.statusId = :statusActive)
                             WHERE
                                 (6371 * acos(
                                           cos( radians(:latitude) )
                                             * cos( radians( d.last_lat ) )
                                             * cos( radians( d.last_lon ) - radians(:longitude) )
                                             + sin( radians(:latitude) )
                                                 * sin( radians( d.last_lat ) )
                                     )
                                     ) <= z.radius AND
                                 (d.status = 'disponivel' OR
                                  (d.status = 'corrida' AND
                                   d.preAvailable = :statusActive AND
                                   d.idDriver NOT IN (
                                                     SELECT pat.driverId
                                                     FROM pre_accepted_trips_view pat
                                                     ) AND
                                   d.idDriver IN (
                                                 SELECT trip.driverId
                                                 FROM trip
                                                 WHERE trip.status = 'in_progress'
                                                 )
                                      )) AND
                                 d.driverRegisterStatusId = :statusActive
                             GROUP BY d.idDriver
                             ) cd on FIND_IN_SET(p.tripTypeId, cd.tripTypes) > 0
            WHERE
                ST_Contains(
                  ca.polygon,
                  ST_GeomFromText(CONCAT('POINT(', :latitude, ' ', :longitude, ')'))
                    ) = 1 AND
                p.statusId = :statusActive AND
                (p.disable_after_km IS NULL OR p.disable_after_km = 0 OR p.disable_after_km >= :distance) AND
                p.tripTypeId = :tripTypeId
            GROUP BY p.id ORDER BY p.tripTypeId ASC
            LIMIT 1
        ";

        $bind = [
            ':now' => now(),
            ':latitude' => $point->getLatitude(),
            ':longitude' => $point->getLongitude(),
            ':statusActive' => Status::ATIVO,
            ':distance' => $distance,
            ':tripTypeId' => $tripTypeId,
        ];

        return $this->sqlRawSelect($sql, $bind)
            ->get(false);
    }

    public function getWaitingTimeFees($request)
    {
        $tripTypeTable = (new TripType)->getTableName();

        $sql = "
            SELECT
                p.waiting_tolerance_seconds,
                p.waiting_extra_fee_per_minute,
                p.waiting_penalty_fee
            FROM {$this->table} p
              INNER JOIN {$tripTypeTable} tt ON p.tripTypeId = tt.idTripType
            WHERE p.cityId = :cityId AND p.tripTypeId = :tripTypeId AND p.statusId = :statusId
        ";

        return $this->sqlRawSelect($sql, [
            'cityId' => $request->cityId,
            'statusId' => Status::ATIVO,
            'tripTypeId' => $request->tripTypeId
        ])->first();
    }
}