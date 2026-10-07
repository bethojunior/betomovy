<?php


namespace App\Repositories\DiscountCoupon;


use App\Contracts\Repository\AbstractRepository;
use App\Models\DiscountCoupon\UserDiscountCoupon;

class UserDiscountCouponRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(UserDiscountCoupon::class);
    }

    public function useCoupon($id)
    {
        $this->getModel()
            ::where("id",$id)
            ->update(["used" => true]);
    }
}
