<?php


namespace App\Repositories\User\Driver;


use App\Contracts\Repository\AbstractRepository;
use App\Models\User\Driver\DriverFormOfPaymentImposition;

class DriverFormOfPaymentImpositionRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(DriverFormOfPaymentImposition::class);
    }

    public function findByDriver(int $driverId)
    {
        return $this->getModel()
            ::where('driverId', $driverId)
            ->with('tripPaymentForm')
            ->get();
    }

    public function deleteAllByDriver(int $driverId)
    {
        return $this->getModel()
            ::where('driverId', $driverId)
            ->delete();
    }
}
