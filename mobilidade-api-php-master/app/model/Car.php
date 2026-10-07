<?php

namespace app\model;

use app\utils\BaseModel;
use app\utils\Photo;

/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 09/09/2018
 * Time: 10:01
 */
class Car extends BaseModel
{
    protected $idCar;
    protected $year;
    protected $plate;
    protected $model;
    protected $color;
    protected $brand;
    protected $driverId;
    protected $renavam;
    protected $document;
    protected $seatsNumber;
    protected $rentalCar;
    protected $rentalCompanyDocument;
    protected $pending;
    protected $created_at;
    protected $updated_at;
    protected $deleted_at;

    public function __construct($obj = null)
    {
        $this->created_at = $obj->created_at ?? now();

        parent::__construct($obj);
        $this->updated_at = now();
    }

    /**
     * @return mixed
     */
    public function getIdCar()
    {
        return $this->idCar;
    }

    /**
     * @param mixed $idCar
     * @return Car
     */
    public function setIdCar($idCar)
    {
        $this->idCar = $idCar;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getYear()
    {
        return $this->year;
    }

    /**
     * @param mixed $year
     * @return Car
     */
    public function setYear($year)
    {
        $this->year = $year;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPlate()
    {
        return $this->plate;
    }

    /**
     * @param mixed $plate
     * @return Car
     */
    public function setPlate($plate)
    {
        $this->plate = $plate;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getModel()
    {
        return $this->model;
    }

    /**
     * @param mixed $model
     * @return Car
     */
    public function setModel($model)
    {
        $this->model = $model;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getColor()
    {
        return $this->color;
    }

    /**
     * @param mixed $color
     * @return Car
     */
    public function setColor($color)
    {
        $this->color = $color;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getBrand()
    {
        return $this->brand;
    }

    /**
     * @param mixed $brand
     * @return Car
     */
    public function setBrand($brand)
    {
        $this->brand = $brand;
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
     * @return Car
     */
    public function setDriverId($driverId)
    {
        $this->driverId = $driverId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getRenavam()
    {
        return $this->renavam;
    }

    /**
     * @param mixed $renavam
     * @return Car
     */
    public function setRenavam($renavam)
    {
        $this->renavam = $renavam;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDocument()
    {
        return $this->document;
    }

    /**
     * @param mixed $image
     * @param $userId
     * @return Car
     * @throws \Exception
     */
    public function setDocument($image, $userId)
    {
        $photo = new Photo;

        $this->document =
            $photo->save($image, "user/{$userId}/docs/", "{$userId}car-");

        return $this;
    }

    /**
     * @return mixed
     */
    public function getSeatsNumber()
    {
        return $this->seatsNumber;
    }

    /**
     * @param mixed $seatsNumber
     * @return Car
     */
    public function setSeatsNumber($seatsNumber)
    {
        $this->seatsNumber = $seatsNumber;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getRentalCar()
    {
        return $this->rentalCar;
    }

    /**
     * @param mixed $rentalCar
     * @return Car
     */
    public function setRentalCar($rentalCar)
    {
        $this->rentalCar = $rentalCar;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getRentalCompanyDocument()
    {
        return $this->rentalCompanyDocument;
    }

    /**
     * @param mixed $rentalCompanyDocument
     * @return Car
     */
    public function setRentalCompanyDocument($rentalCompanyDocument)
    {
        $this->rentalCompanyDocument = $rentalCompanyDocument;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPending()
    {
        return $this->pending;
    }

    /**
     * @param $pending
     * @return $this
     */
    public function setPending($pending)
    {
        $this->pending = $pending;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCreatedAt()
    {
        return $this->created_at;
    }

    /**
     * @param mixed $created_at
     * @return Car
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getUpdatedAt()
    {
        return $this->updated_at;
    }

    /**
     * @param mixed $updated_at
     * @return Car
     */
    public function setUpdatedAt($updated_at)
    {
        $this->updated_at = $updated_at;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDeletedAt()
    {
        return $this->deleted_at;
    }

    /**
     * @param $deleted_at
     * @return Car
     */
    public function setDeletedAt($deleted_at)
    {
        $this->deleted_at = $deleted_at;
        return $this;
    }
}