<?php

namespace app\model;

use app\utils\BaseModel;

class DriverSplitValue extends BaseModel
{
    protected int $id;

    protected int $driverId;

    protected int $tripId;

    protected ?string $transactionId;

    protected float $amount;

    protected string $status;

    protected string $created_at;

    protected string $updated_at;

    protected ?string $log;

    protected $primaryKey = 'id';

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

    public function setId(int $id): DriverSplitValue
    {
        $this->id = $id;
        return $this;
    }

    public function getDriverId(): int
    {
        return $this->driverId;
    }

    public function setDriverId(int $driverId): DriverSplitValue
    {
        $this->driverId = $driverId;
        return $this;
    }

    public function getTripId(): int
    {
        return $this->tripId;
    }

    public function setTripId(int $tripId): DriverSplitValue
    {
        $this->tripId = $tripId;
        return $this;
    }

    public function getTransactionId(): ?string
    {
        return $this->transactionId;
    }

    public function setTransactionId(?string $transactionId): DriverSplitValue
    {
        $this->transactionId = $transactionId;
        return $this;
    }

    public function getAmount(): float
    {
        return $this->amount;
    }

    public function setAmount(float $amount): DriverSplitValue
    {
        $this->amount = $amount;
        return $this;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setStatus(string $status): DriverSplitValue
    {
        $this->status = $status;
        return $this;
    }

    public function getCreatedAt(): string
    {
        return $this->created_at;
    }

    public function setCreatedAt(string $created_at): DriverSplitValue
    {
        $this->created_at = $created_at;
        return $this;
    }

    public function getUpdatedAt(): string
    {
        return $this->updated_at;
    }

    public function setUpdatedAt(string $updated_at): DriverSplitValue
    {
        $this->updated_at = $updated_at;
        return $this;
    }

    public function getLog(): ?string
    {
        return $this->log;
    }

    public function setLog(?string $log): DriverSplitValue
    {
        $this->log = $log;
        return $this;
    }
}