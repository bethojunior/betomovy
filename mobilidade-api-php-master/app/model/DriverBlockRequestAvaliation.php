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
class DriverBlockRequestAvaliation extends BaseModel
{
    protected $id;
    protected $tripReference;
    protected $idDriver;
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
     * @return DriverBlockRequestAvaliation
     */

    public function setId($id)
    {
      $this->id = $id;
      return $this;
    }

    /**
     * @return mixed
     */
    public function getTripReference()
    {
        return $this->tripReference;
    }

    /**
     * @param mixed $tripReference
     * @return $this
     */
    public function setTripReference($tripReference)
    {
        $this->tripReference = $tripReference;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getIdDriver()
    {
        return $this->idDriver;
    }

    /**
     * @param mixed $idDriver
     * @return DriverBlockRequestAvaliation
     */
    public function setIdDriver($idDriver)
    {
        $this->idDriver = $idDriver;
        return $this;
    }
}