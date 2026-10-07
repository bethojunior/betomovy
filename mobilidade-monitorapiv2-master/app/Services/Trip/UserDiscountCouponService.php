<?php


namespace App\Services\Trip;


use App\Models\Trip\Trip;
use App\Repositories\DiscountCoupon\UserDiscountCouponRepository;
use App\Repositories\Trip\TripDiscountCouponRepository;

class UserDiscountCouponService
{
    private $tripDiscountCouponRepository;
    private $userDiscountCouponRepository;

    public function __construct(
        TripDiscountCouponRepository $tripDiscountCouponRepository,
        UserDiscountCouponRepository $userDiscountCouponRepository
    )
    {
        $this->tripDiscountCouponRepository = $tripDiscountCouponRepository;
        $this->userDiscountCouponRepository = $userDiscountCouponRepository;
    }

    public function useCoupon(Trip $trip)
    {
        $tripDiscountCoupon = $this->tripDiscountCouponRepository->findByTrip($trip->tripReference);

        if ($tripDiscountCoupon)
            $this->userDiscountCouponRepository->useCoupon($tripDiscountCoupon->userDiscountCouponId);
    }
}
