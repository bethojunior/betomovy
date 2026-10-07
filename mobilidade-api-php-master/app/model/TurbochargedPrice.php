<?php

namespace app\model;

use app\utils\BaseModel;
use app\utils\UUID;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 23/07/2018
 * Time: 17:26
 */
class TurbochargedPrice extends BaseModel
{
    protected $id;
    protected $idTrip;
    protected $oldPrice;
    protected $turbochargedPrice;
    protected $created_at;
    protected $updated_at;

    public function __construct($obj = null)
    {
        $this->created_at = now();

        parent::__construct($obj);
    }

    /**
     * @return mixed
     */
    public function getId() 
    {
      return $this->id;
    }

        /**
     * @param $id
     * @return TurbochargedPrice
     */
    public function setId($id)
    {
      $this->id = $id;
      return $this;
    }

    /**
     * @return mixed
     */
    public function getIdTrip()
    {
        return $this->idTrip;
    }

    /**
    * @return $this
     */
    public function setIdTrip($idTrip)
    {
        $this->idTrip = $idTrip;
        return $this;
    }

        /**
     * @return mixed
     */
    public function getOldPrice()
    {
        return $this->oldPrice;
    }

    /**
     * @param mixed $oldPrice
     * @return TurbochargedPrice
     */
    public function setOldPrice($oldPrice)
    {
        $this->oldPrice = $oldPrice;
        return $this;
    }

    /**
     * @return string
     */
    public function getTurbochargedPrice()
    {
      return $this->turbochargedPrice;
    }

    public function setTurbochargedPrice($turbochargedPrice)
    {
        $this->turbochargedPrice = $turbochargedPrice;
        return $this;
    }

}