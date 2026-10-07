<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 23/07/2018
 * Time: 10:08
 */
class RoutePrice extends BaseModel
{
    protected $idRoutePrice;
    protected $establishmentId;
    protected $stationId;
    protected $price;

    protected $table = "routePrice";

    /**
     * @return mixed
     */
    public function getIdRoutePrice()
    {
        return $this->idRoutePrice;
    }

    /**
     * @param mixed $idRoutePrice
     */
    public function setIdRoutePrice($idRoutePrice): void
    {
        $this->idRoutePrice = $idRoutePrice;
    }

    /**
     * @return mixed
     */
    public function getEstablishmentId()
    {
        return $this->establishmentId;
    }

    /**
     * @param mixed $establishmentId
     */
    public function setEstablishmentId($establishmentId): void
    {
        $this->establishmentId = $establishmentId;
    }

    /**
     * @return mixed
     */
    public function getStationId()
    {
        return $this->stationId;
    }

    /**
     * @param mixed $stationId
     */
    public function setStationId($stationId): void
    {
        $this->stationId = $stationId;
    }

    /**
     * @return mixed
     */
    public function getPrice()
    {
        return $this->price;
    }

    /**
     * @param mixed $price
     */
    public function setPrice($price): void
    {
        $this->price = $price;
    }
}