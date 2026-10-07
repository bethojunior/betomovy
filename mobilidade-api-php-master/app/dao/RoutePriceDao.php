<?php

namespace app\dao;

use app\services\PriceCustomerService;
use app\utils\BaseDao;
use app\utils\Connection;
use Exception;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 23/07/2018
 * Time: 08:48
 */
class RoutePriceDao extends BaseDao
{
    protected $table = "routePrice";
    private $priceService;

    public function __construct($conn = null, string $dbtype = Connection::DB_MYSQL)
    {
        parent::__construct($conn, $dbtype);
        $this->priceService = new PriceCustomerService;
    }

    /**
     * @param $establishmentId
     * @param $stationId
     * @return float|int
     * @throws Exception
     */
    public function checkPrice($establishmentId, $stationId)
    {
        $establishment = (new EstablishmentDao)->sqlSelect(
            ['idEstablishment', 'latitude', 'longitude'], [['idEstablishment', '=', $establishmentId]], [], 1
        )->get(false);

        $station = (new StationDao)->sqlSelect(
            ['idStation', 'latitude', 'longitude'], [['idStation', '=', $stationId]], [], 1
        )->get(false);

        return $this->priceService->getTripPrice($establishment->latitude,
            $establishment->longitude,
            $station->latitude,
            $station->longitude);
    }
}