<?php

namespace Delivery\Repositories\Delivery;

use App\Contracts\Repository\AbstractRepository;
use Delivery\Models\Delivery\DeliverySection;

class DeliverySectionRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(DeliverySection::class);
    }


}
