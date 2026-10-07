<?php

namespace Api\Repositories\Product;

use App\Models\Product\DeliveryCategory;
use Common\Contracts\Repository\AbstractRepository;

class DeliveryCategoryRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(DeliveryCategory::class);
    }
}
