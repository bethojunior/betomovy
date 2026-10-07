<?php


namespace App\Repositories\Delivery;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Delivery\TypeDeliveryCategory;

class TypeDeliveryCategoryRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(TypeDeliveryCategory::class);
    }

    public function findAll()
    {
        return $this->getModel()
            ::where("statusId", StatusConst::ACTIVE)
            ->orderBy("name", "ASC")
            ->get();
    }
}
