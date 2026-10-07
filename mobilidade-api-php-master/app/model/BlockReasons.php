<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 19/09/2018
 * Time: 17:47
 */
class BlockReasons extends BaseModel
{
    protected $idBlockReasons;
    protected $blockReasonsTypeId;
    protected $statusId;
    protected $driverId;
    protected $date;

    protected $table = 'blockReasons';

    public function __construct($obj = null)
    {
        parent::__construct($obj);

        $this->date = empty($this->date) ? now() : $this->date;
    }

    /**
     * @return mixed
     */
    public function getIdBlockReasons()
    {
        return $this->idBlockReasons;
    }

    /**
     * @param mixed $idBlockReasons
     * @return BlockReasons
     */
    public function setIdBlockReasons($idBlockReasons)
    {
        $this->idBlockReasons = $idBlockReasons;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getBlockReasonsTypeId()
    {
        return $this->blockReasonsTypeId;
    }

    /**
     * @param mixed $blockReasonsTypeId
     * @return BlockReasons
     */
    public function setBlockReasonsTypeId($blockReasonsTypeId)
    {
        $this->blockReasonsTypeId = $blockReasonsTypeId;
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
     * @return BlockReasons
     */
    public function setStatusId($statusId)
    {
        $this->statusId = $statusId;
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
     * @return BlockReasons
     */
    public function setDriverId($driverId)
    {
        $this->driverId = $driverId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDate()
    {
        return $this->date;
    }

    /**
     * @param mixed $date
     * @return BlockReasons
     */
    public function setDate($date)
    {
        $this->date = $date;
        return $this;
    }
}