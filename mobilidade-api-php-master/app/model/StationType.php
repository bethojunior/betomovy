<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 23/07/2018
 * Time: 11:52
 */
class StationType extends BaseModel
{
    protected $table = "stationType";

    protected $idStationType;
    protected $name;
    protected $statusId;

    /**
     * @return mixed
     */
    public function getIdStationType()
    {
        return $this->idStationType;
    }

    /**
     * @param mixed $idStationType
     */
    public function setIdStationType($idStationType): void
    {
        $this->idStationType = $idStationType;
    }

    /**
     * @return mixed
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param mixed $name
     */
    public function setName($name): void
    {
        $this->name = $name;
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
     */
    public function setStatusId($statusId): void
    {
        $this->statusId = $statusId;
    }

}