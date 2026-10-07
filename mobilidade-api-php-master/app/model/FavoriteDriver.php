<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 12/12/2018
 * Time: 17:51
 */
class FavoriteDriver extends BaseModel
{
    protected $idFavorite;
    protected $customerId;
    protected $driverId;
    protected $status;
    protected $created_at;

    public function __construct($obj = null)
    {
        $this->created_at = now();
        parent::__construct($obj);
    }

    /**
     * @return mixed
     */
    public function getIdFavorite()
    {
        return $this->idFavorite;
    }

    /**
     * @param mixed $idFavorite
     * @return FavoriteDriver
     */
    public function setIdFavorite($idFavorite)
    {
        $this->idFavorite = $idFavorite;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCustomerId()
    {
        return $this->customerId;
    }

    /**
     * @param mixed $customerId
     * @return FavoriteDriver
     */
    public function setCustomerId($customerId)
    {
        $this->customerId = $customerId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDriverId()
    {
        return $this->driverId;
    }

    /**
     * @param mixed $driverId
     * @return FavoriteDriver
     */
    public function setDriverId($driverId)
    {
        $this->driverId = $driverId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * @param mixed $status
     * @return FavoriteDriver
     */
    public function setStatus($status)
    {
        $this->status = $status;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCreatedAt()
    {
        return $this->created_at;
    }

    /**
     * @param mixed $created_at
     * @return FavoriteDriver
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
        return $this;
    }


}