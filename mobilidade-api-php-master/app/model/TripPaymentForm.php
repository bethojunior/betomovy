<?php

namespace app\model;

use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 08/10/2018
 * Time: 17:30
 */
class TripPaymentForm extends BaseModel
{
    protected $idTripPaymentForm;
    protected $name;

    protected $table = "tripPaymentForm";

    /**
     * @return mixed
     */
    public function getIdTripPaymentForm()
    {
        return $this->idTripPaymentForm;
    }

    /**
     * @param mixed $idTripPaymentForm
     * @return TripPaymentForm
     */
    public function setIdTripPaymentForm($idTripPaymentForm)
    {
        $this->idTripPaymentForm = $idTripPaymentForm;
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
     * @return TripPaymentForm
     */
    public function setName($name)
    {
        $this->name = $name;
        return $this;
    }

}