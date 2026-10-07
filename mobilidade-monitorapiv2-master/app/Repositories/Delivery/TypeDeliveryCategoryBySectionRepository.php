<?php

namespace App\Repositories\Delivery;

use App\Contracts\Repository\AbstractRepository;
use App\Models\Delivery\TypeDeliveryCategoryBySection;

class TypeDeliveryCategoryBySectionRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(TypeDeliveryCategoryBySection::class);
    }

    public function deleteAllByTypeDeliveryCategory($typeDeliveryCategoryId)
    {
        $this->getModel()
            ::where("typeDeliveryCategoryId", $typeDeliveryCategoryId)
            ->delete();
    }

    public function findByTypeDeliveryCategory($typeDeliveryCategoryId)
    {
        return $this->getModel()
            ::where("typeDeliveryCategoryId", $typeDeliveryCategoryId)
            ->get();
    }
}
