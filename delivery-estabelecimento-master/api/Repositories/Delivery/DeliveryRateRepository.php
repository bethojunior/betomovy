<?php


namespace Api\Repositories\Delivery;


use App\Constants\StatusConst;
use App\Models\Delivery\DeliveryRate;
use Common\Contracts\Repository\AbstractRepository;

class DeliveryRateRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(DeliveryRate::class);
    }

    public function findAll()
    {
        return $this->getModel()
            ::where("statusId", StatusConst::ACTIVE)
            ->get();
    }
}
