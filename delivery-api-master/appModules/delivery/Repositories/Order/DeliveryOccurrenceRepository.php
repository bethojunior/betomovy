<?php


namespace Delivery\Repositories\Order;


use App\Contracts\Repository\AbstractRepository;
use Delivery\Models\Order\DeliveryOccurrence;

class DeliveryOccurrenceRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(DeliveryOccurrence::class);
    }
}
