<?php

namespace app\dao;

use app\constant\AppConst;
use app\constant\GenderConst;
use app\utils\BaseDao;
use app\utils\Connection;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 31/10/2019
 * Time: 10:24
 */

// Read-only class
class AdvertisingDao extends BaseDao
{
    protected $table = "advertising";

    public function __construct($conn = null, string $dbtype = Connection::DB_MYSQL_RO)
    {
        parent::__construct($conn, $dbtype);
    }

    public function findByCoordinate($lat, $lng, $onlyOne = true, $appId = AppConst::CUSTOMER)
    {
        $limit = $onlyOne ?
            'LIMIT 1' : 'LIMIT 4';

        $sql = /** @lang sql */
            "
            SELECT
                ads.id,
                CONCAT(c.value, ads.thumbnail) AS thumbnail,
                CONCAT(c.value, ads.banner) AS banner,
                ads.description,
                ads.link
            FROM advertising ads
                INNER JOIN config c ON c.`key` = 'link_storage_pictures'
                INNER JOIN cityArea ca
                    ON (
                        ads.cityId = ca.cityId AND
                        ca.statusId = 1 AND
                        ST_Contains(
                          ca.polygon,
                          ST_GeomFromText(CONCAT('POINT(',:lat, ' ', :lng, ')'))) = 1)
                WHERE
                      ads.statusId = 1 AND
                      :now BETWEEN ads.dateStart AND ads.dateEnd AND
                      ads.appId = :appId
                ORDER BY RAND()
                {$limit}
        ";

        return $this->sqlRawSelect($sql, [
            ':lat' => $lat,
            ':lng' => $lng,
            ':now' => now(),
            ':appId' => $appId
        ])
            ->get(!$onlyOne ?: false);
    }

    public function findAllByCoordinate($lat, $lng, $appId = AppConst::CUSTOMER, $genderId = null, $advertisingAppSiteId = null)
    {
        $genderFilter = $genderId !== null ? 'AND ads.genderId IN (:genderId, :allGenderId)' : '';
        $advertisingAppSiteFilter = $advertisingAppSiteId !== null ? 'AND ads.advertisingAppSiteId = :advertisingAppSiteId' : '';

        $sql = /** @lang sql */
            "
            SELECT
                ads.id,
                CONCAT(c.value, ads.thumbnail) AS thumbnail,
                CONCAT(c.value, ads.banner) AS banner,
                ads.description,
                ads.link,
                ads.displayOrder,
                ads.amountOfTime
            FROM advertising ads
                INNER JOIN config c ON c.`key` = 'link_storage_pictures'
                INNER JOIN cityArea ca
                    ON (
                        ads.cityId = ca.cityId AND
                        ca.statusId = 1 AND
                        ST_Contains(
                          ca.polygon,
                          ST_GeomFromText(CONCAT('POINT(',:lat, ' ', :lng, ')'))) = 1)
                WHERE
                      ads.statusId = 1 AND
                      :now BETWEEN ads.dateStart AND ads.dateEnd AND
                      ads.appId = :appId
                      {$genderFilter}
                      {$advertisingAppSiteFilter}
                ORDER BY ads.displayOrder
        ";

        $params = [
            ':lat' => $lat,
            ':lng' => $lng,
            ':now' => now(),
            ':appId' => $appId
        ];

        if ($genderId !== null) {
            $params[':genderId'] = $genderId;
            $params[':allGenderId'] = GenderConst::ALL_ID;
        }

        if ($advertisingAppSiteId !== null) {
            $params[':advertisingAppSiteId'] = $advertisingAppSiteId;
        }

        return $this->sqlRawSelect($sql, $params)->get();
    }
}