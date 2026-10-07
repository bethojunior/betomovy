<?php

namespace app\dtos;

class TripCallPushDTO
{
    private ?float $price;
    private ?string $vehicleCategory;
    private ?float $proximityKm;
    private ?string $tripReference;
    private ?int $userId;
    private ?int $tripCallTypeId;

    public function __construct(
        ?float $price = null,
        ?string $vehicleCategory = null,
        ?float $proximityKm = null,
        ?string $tripReference = null,
        ?int $userId = null,
        ?int $tripCallTypeId = null
    )
    {
        $this->price = $price;
        $this->vehicleCategory = $vehicleCategory;
        $this->proximityKm = $proximityKm;
        $this->tripReference = $tripReference;
        $this->userId = $userId;
        $this->tripCallTypeId = $tripCallTypeId;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(?float $price): TripCallPushDTO
    {
        $this->price = $price;
        return $this;
    }

    public function getVehicleCategory(): ?string
    {
        return $this->vehicleCategory;
    }

    public function setVehicleCategory(?string $vehicleCategory): TripCallPushDTO
    {
        $this->vehicleCategory = $vehicleCategory;
        return $this;
    }

    public function getProximityKm(): ?float
    {
        return $this->proximityKm;
    }

    public function setProximityKm(?float $proximityKm): TripCallPushDTO
    {
        $this->proximityKm = $proximityKm;
        return $this;
    }

    public function getTripReference(): ?string
    {
        return $this->tripReference;
    }

    public function setTripReference(?string $tripReference): TripCallPushDTO
    {
        $this->tripReference = $tripReference;
        return $this;
    }

    public function getUserId(): ?int
    {
        return $this->userId;
    }

    public function setUserId(?int $userId): TripCallPushDTO
    {
        $this->userId = $userId;
        return $this;
    }

    public function getTripCallTypeId(): ?int
    {
        return $this->tripCallTypeId;
    }

    public function setTripCallTypeId(?int $tripCallTypeId): TripCallPushDTO
    {
        $this->tripCallTypeId = $tripCallTypeId;
        return $this;
    }

    public function toArray(): array
    {
        return [
            'price' => $this->getPrice(),
            'vehicleCategory' => $this->getVehicleCategory(),
            'proximityKm' => $this->getProximityKm(),
            'tripReference' => $this->getTripReference(),
            'userId' => $this->getUserId(),
            'tripCallTypeId' => $this->getTripCallTypeId(),
        ];
    }
}
