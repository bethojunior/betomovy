<?php


namespace App\Services\Delivery;


use App\Repositories\Delivery\PayMachineReturnTypeRepository;

class PayMachineReturnTypeService
{
    private $repository;

    public function __construct(PayMachineReturnTypeRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll()
    {
        return $this->repository->all();
    }
}
