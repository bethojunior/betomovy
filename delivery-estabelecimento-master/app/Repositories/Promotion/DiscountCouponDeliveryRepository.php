<?php


namespace App\Repositories\Promotion;


use App\Constants\StatusConst;
use App\Models\Promotion\DiscountCouponDelivery;
use Common\Contracts\Repository\AbstractRepository;

class DiscountCouponDeliveryRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(DiscountCouponDelivery::class);
    }

    public function existCodeByCompany(DiscountCouponDelivery $discountCouponDelivery)
    {
        return $this->getModel()
            ::where("code", $discountCouponDelivery->code)
            ->where("statusId", StatusConst::ACTIVE)
            ->whereRaw("((? BETWEEN dateStart AND dateEnd) OR (? BETWEEN dateStart AND dateEnd))",
                [$discountCouponDelivery->dateStart, $discountCouponDelivery->dateEnd])
            ->first();
    }

    public function findAll($companyId)
    {
        return $this->getModel()
            ::where("companyId", $companyId)
            ->where("statusId", StatusConst::ACTIVE)
            ->orderBy("id", 'DESC')
            ->get();
    }
}
