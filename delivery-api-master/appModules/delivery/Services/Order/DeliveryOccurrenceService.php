<?php


namespace Delivery\Services\Order;


use Delivery\Models\Order\DeliveryOccurrence;
use Delivery\Repositories\Order\DeliveryOccurrenceRepository;

class DeliveryOccurrenceService
{
    private $repository;

    public function __construct(DeliveryOccurrenceRepository $repository)
    {
        $this->repository = $repository;
    }

    public function store(array $request)
    {
        $deliveryOccurrence = new DeliveryOccurrence($request);
        $deliveryOccurrence->save();

        return $deliveryOccurrence;
    }
}
