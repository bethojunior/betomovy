<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 10/01/2019
 * Time: 14:40
 */
class SchedulePriceDynamic extends BaseModel
{
    protected $idSchedulePriceDynamic;
    protected $timeStart;
    protected $timeEnd;
    protected $priceDynamicId;
    protected $statusId;

    /**
     * @return mixed
     */
    public function getIdSchedulePriceDynamic()
    {
        return $this->idSchedulePriceDynamic;
    }

    /**
     * @param mixed $idSchedulePriceDynamic
     * @return SchedulePriceDynamic
     */
    public function setIdSchedulePriceDynamic($idSchedulePriceDynamic)
    {
        $this->idSchedulePriceDynamic = $idSchedulePriceDynamic;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTimeStart()
    {
        return $this->timeStart;
    }

    /**
     * @param mixed $timeStart
     * @return SchedulePriceDynamic
     */
    public function setTimeStart($timeStart)
    {
        $this->timeStart = $timeStart;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTimeEnd()
    {
        return $this->timeEnd;
    }

    /**
     * @param mixed $timeEnd
     * @return SchedulePriceDynamic
     */
    public function setTimeEnd($timeEnd)
    {
        $this->timeEnd = $timeEnd;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPriceDynamicId()
    {
        return $this->priceDynamicId;
    }

    /**
     * @param mixed $priceDynamicId
     * @return SchedulePriceDynamic
     */
    public function setPriceDynamicId($priceDynamicId)
    {
        $this->priceDynamicId = $priceDynamicId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getStatusId()
    {
        return $this->statusId;
    }

    /**
     * @param mixed $statusId
     * @return SchedulePriceDynamic
     */
    public function setStatusId($statusId)
    {
        $this->statusId = $statusId;
        return $this;
    }

}