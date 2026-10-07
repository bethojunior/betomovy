<?php


namespace app\model;

use app\utils\BaseModel;

class Tax extends BaseModel
{
    protected $id;
    protected $name;
    protected $value;
    protected $valueType;
    protected $description;
    protected $cityId;
    protected $tripTypeId;
    protected $chargeBy;
    protected $userId;
    protected $active;
    protected $created_at;
    protected $updated_at;
    protected $deleted_at;

//    public function __construct($obj = null)
//    {
//        $this->created_at = $obj->created_at ?? now();
//        parent::__construct($obj);
//
//        $this->updated_at = now();
//    }

    public function getId(): int
    {
        return $this->id;
    }

    public function setId(int $id): Tax
    {
        $this->id = $id;
        return $this;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): Tax
    {
        $this->name = $name;
        return $this;
    }

    public function getValue(): float
    {
        return $this->value;
    }

    public function setValue(float $value): Tax
    {
        $this->value = $value;
        return $this;
    }

    public function getValueType(): string
    {
        return $this->valueType;
    }

    public function setValueType(string $valueType): Tax
    {
        $this->valueType = $valueType;
        return $this;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function setDescription(string $description): Tax
    {
        $this->description = $description;
        return $this;
    }

    public function getCityId(): int
    {
        return $this->cityId;
    }

    public function setCityId(int $cityId): Tax
    {
        $this->cityId = $cityId;
        return $this;
    }

    public function getTripTypeId(): int
    {
        return $this->tripTypeId;
    }

    public function setTripTypeId(int $tripTypeId): Tax
    {
        $this->tripTypeId = $tripTypeId;
        return $this;
    }

    public function getChargeBy(): string
    {
        return $this->chargeBy;
    }

    public function setChargeBy(string $chargeBy): Tax
    {
        $this->chargeBy = $chargeBy;
        return $this;
    }

    public function getUserId(): int
    {
        return $this->userId;
    }

    public function setUserId(int $userId): Tax
    {
        $this->userId = $userId;
        return $this;
    }

    public function getActive(): bool
    {
        return (bool)$this->active;
    }

    public function setActive(bool $active): Tax
    {
        $this->active = $active;
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
     * @return Tax
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
     * @return Tax
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
     * @param mixed $deleted_at
     * @return Tax
     */
    public function setDeletedAt($deleted_at)
    {
        $this->deleted_at = $deleted_at;
        return $this;
    }
}