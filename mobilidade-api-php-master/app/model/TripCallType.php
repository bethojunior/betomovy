<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 22/02/2019
 * Time: 10:00
 */
class TripCallType extends BaseModel
{
    protected $primaryKey = 'id';

    protected $id;
    protected $name;
    protected $statusId;

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     * @return TripCallType
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
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
     * @return TripCallType
     */
    public function setName($name)
    {
        $this->name = $name;
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
     * @return TripCallType
     */
    public function setStatusId($statusId)
    {
        $this->statusId = $statusId;
        return $this;
    }

}