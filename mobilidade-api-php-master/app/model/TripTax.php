<?php


namespace app\model;

use app\utils\BaseModel;

class TripTax extends BaseModel
{
    protected $id;
    protected $tripId;
    protected $taxId;
    protected $created_at;
    protected $updated_at;

    public function __construct($obj = null)
    {
        $this->created_at = $obj->created_at ?? now();
        parent::__construct($obj);

        $this->updated_at = now();
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function setId($id): TripTax
    {
        $this->id = $id;
        return $this;
    }

    public function getTripId(): int
    {
        return $this->tripId;
    }

    public function setTripId(int $tripId): TripTax
    {
        $this->tripId = $tripId;
        return $this;
    }

    public function getTaxId(): int
    {
        return $this->taxId;
    }

    public function setTaxId(int $taxId): TripTax
    {
        $this->taxId = $taxId;
        return $this;
    }

    /**
     * @return false|string
     */
    public function getCreatedAt()
    {
        return $this->created_at;
    }

    /**
     * @param false|string $created_at
     * @return TripTax
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
        return $this;
    }

    /**
     * @return false|string
     */
    public function getUpdatedAt()
    {
        return $this->updated_at;
    }

    /**
     * @param false|string $updated_at
     * @return TripTax
     */
    public function setUpdatedAt($updated_at): TripTax
    {
        $this->updated_at = $updated_at;
        return $this;
    }
}