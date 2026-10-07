<?php


namespace App\Repositories\Delivery;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Delivery\PayMachineReturnType;

class PayMachineReturnTypeRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(PayMachineReturnType::class);
    }
}
