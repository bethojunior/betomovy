<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 06/11/2019
 * Time: 17:04
 */
class TripRouteTracing extends BaseModel
{
    protected $id;
    protected $tripReference;
    protected $tracing;

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     * @return TripRouteTracing
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
     * @return TripRouteTracing
     */
    public function setTripReference($tripReference)
    {
        $this->tripReference = $tripReference;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTracing()
    {
        return $this->tracing;
    }

    /**
     * @param mixed $tracing
     * @return TripRouteTracing
     */
    public function setTracing($tracing)
    {
        $this->tracing = $tracing;
        return $this;
    }

}