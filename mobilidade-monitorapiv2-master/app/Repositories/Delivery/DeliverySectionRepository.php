<?php

namespace App\Repositories\Delivery;

use App\Contracts\Repository\AbstractRepository;
use App\Models\Delivery\DeliverySection;

class DeliverySectionRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(DeliverySection::class);
    }
}
