<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/08/2020
 * Time: 12:50
 */
class TollTrip extends BaseModel
{
    protected $id;
    protected $tripId;
    protected $tollId;

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     * @return TollTrip
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTripId()
    {
        return $this->tripId;
    }

    /**
     * @param mixed $tripId
     * @return TollTrip
     */
    public function setTripId($tripId)
    {
        $this->tripId = $tripId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTollId()
    {
        return $this->tollId;
    }

    /**
     * @param mixed $tollId
     * @return TollTrip
     */
    public function setTollId($tollId)
    {
        $this->tollId = $tollId;
        return $this;
    }

}