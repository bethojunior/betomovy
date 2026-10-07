<?php


namespace App\Repositories\Trip;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Trip\TripDiscountCoupon;

class TripDiscountCouponRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(TripDiscountCoupon::class);
    }

    public function findByTrip($tripReference)
    {
        return $this->getModel()
            ::where("tripReference", $tripReference)
            ->first();
    }
}
