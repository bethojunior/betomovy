<?php

namespace App\Repositories\Trip;

use App\Contracts\Repository\AbstractRepository;
use App\Models\Trip\TripCardPayment;

class TripCardPaymentRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(TripCardPayment::class);
    }

    public function findByTrip(string $tripReference): TripCardPayment
    {
        /** @var TripCardPayment $tripCardPayment */
        $tripCardPayment = $this->getQuery()
            ->where('tripReference', $tripReference)
            ->with('transaction')
            ->first();

        return $tripCardPayment;
    }
}
