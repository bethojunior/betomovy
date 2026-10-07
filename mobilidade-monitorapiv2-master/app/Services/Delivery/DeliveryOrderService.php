<?php


namespace App\Services\Delivery;


use App\Repositories\Delivery\DeliveryOrderRepository;

class DeliveryOrderService
{
    private $repository;

    public function __construct(DeliveryOrderRepository $repository)
    {
        $this->repository = $repository;
    }

    public function actives(int $cityId)
    {
        return $this->repository->actives($cityId);
    }
}
