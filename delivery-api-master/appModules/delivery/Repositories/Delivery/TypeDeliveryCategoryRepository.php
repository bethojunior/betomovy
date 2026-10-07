<?php

namespace Delivery\Repositories\Delivery;

use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use Delivery\Models\Delivery\TypeDeliveryCategory;

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
            ->orderBy("name")
            ->get();
    }
}
