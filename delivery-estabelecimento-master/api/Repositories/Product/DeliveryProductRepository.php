<?php

namespace Api\Repositories\Product;

use Common\Contracts\Repository\AbstractRepository;
use Common\Models\Order\DeliveryProduct;

class DeliveryProductRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(DeliveryProduct::class);
    }
}
