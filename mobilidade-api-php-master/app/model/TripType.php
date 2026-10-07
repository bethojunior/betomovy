<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/11/2018
 * Time: 17:16
 */
class TripType extends BaseModel
{
    protected $idTripType;
    protected $type;
    protected $loopingOption;

    protected $table = "tripType";

    /**
     * @return mixed
     */
    public function getIdTripType()
    {
        return $this->idTripType;
    }

    /**
     * @param mixed $idTripType
     * @return TripType
     */
    public function setIdTripType($idTripType)
    {
        $this->idTripType = $idTripType;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @param mixed $type
     * @return TripType
     */
    public function setType($type)
    {
        $this->type = $type;
        return $this;
    }

    /**
     * @return int|null
     */
    public function getLoopingOption()
    {
        return $this->loopingOption;
    }

    /**
     * @param int|null $loopingOption
     * @return TripType
     */
    public function setLoopingOption($loopingOption)
    {
        $this->loopingOption = $loopingOption;
        return $this;
    }
}
