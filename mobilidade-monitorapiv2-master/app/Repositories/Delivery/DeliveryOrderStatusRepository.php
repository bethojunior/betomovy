<?php


namespace App\Repositories\Delivery;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Delivery\DeliveryOrderStatus;

class DeliveryOrderStatusRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(DeliveryOrderStatus::class);
    }

    public function listBySelect()
    {
        return $this->getModel()
            ::select(
                'id',
                'label AS text'
            )
            ->get();
    }
}
