<?php

namespace app\model;

use app\utils\BaseModel;

class QueueFinishedTrip extends BaseModel
{
    protected $id;
    protected $idUser;
    protected $idTrip;
    protected $date;
    protected $price;
    protected $used;

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return mixed
     */
    public function getIdUser()
    {
        return $this->idUser;
    }

    /**
     * @param mixed $idUser
     */
    public function setIdUser($idUser)
    {
        $this->idUser = $idUser;
    }

    /**
     * @return mixed
     */
    public function getIdTrip()
    {
        return $this->idTrip;
    }

    /**
     * @param mixed $idTrip
     */
    public function setIdTrip($idTrip)
    {
        $this->idTrip = $idTrip;
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
     */
    public function setDate($date)
    {
        $this->date = $date;
    }

    /**
     * @return mixed
     */
    public function getPrice()
    {
        return $this->price;
    }

    /**
     * @param mixed $price
     */
    public function setPrice($price)
    {
        $this->price = $price;
    }

    /**
     * @return mixed
     */
    public function getUsed()
    {
        return $this->used;
    }

    /**
     * @param mixed $used
     * @return QueueFinishedTrip
     */
    public function setUsed($used)
    {
        $this->used = $used;
        return $this;
    }
}