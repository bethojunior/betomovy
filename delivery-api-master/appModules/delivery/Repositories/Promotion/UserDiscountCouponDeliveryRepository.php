<?php


namespace Delivery\Repositories\Promotion;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use Delivery\Models\Promotion\UserDiscountCouponDelivery;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserDiscountCouponDeliveryRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(UserDiscountCouponDelivery::class);
    }

    public function couponAlreadyAdded(UserDiscountCouponDelivery $userDiscountCouponDelivery)
    {
        return $this->getModel()
            ::where("userId", $userDiscountCouponDelivery->userId)
            ->where("discountCouponDeliveryId", $userDiscountCouponDelivery->discountCouponDeliveryId)
            ->first();
    }

    public function findAll($userId)
    {
        return $this->getModel()
            ::where("userId", $userId)
            ->join("discountCouponDelivery", "discountCouponDelivery.id", "discountCouponDeliveryId")
            ->join("company", "company.id" , "discountCouponDelivery.companyId")
            ->where("used", false)
            ->where("discountCouponDelivery.statusId", StatusConst::ACTIVE)
            ->whereRaw("(now() BETWEEN discountCouponDelivery.dateStart AND discountCouponDelivery.dateEnd)")
            ->select(
                "userDiscountCouponDelivery.id",
                "discountCouponDelivery.code",
                "discountCouponDelivery.value",
                "discountCouponDelivery.valueType",
                "discountCouponDelivery.fromValue",
                "discountCouponDelivery.dateStart",
                "discountCouponDelivery.dateEnd",
                "discountCouponDelivery.companyId",
                "company.fantasyName"
                )
            ->orderByDesc("userDiscountCouponDelivery.id")
        ->get();
    }

    public function findAllCompany($userId,$companyId)
    {
        return $this->getModel()
            ::where("userId", $userId)
            ->where("companyId", $companyId)
            ->join("discountCouponDelivery", "discountCouponDelivery.id", "discountCouponDeliveryId")
            ->join("company", "company.id" , "discountCouponDelivery.companyId")
            ->where("used", false)
            ->where("discountCouponDelivery.statusId", StatusConst::ACTIVE)
            ->whereRaw("(now() BETWEEN discountCouponDelivery.dateStart AND discountCouponDelivery.dateEnd)")
            ->select(
                "userDiscountCouponDelivery.id",
                "discountCouponDelivery.code",
                "discountCouponDelivery.value",
                "discountCouponDelivery.valueType",
                "discountCouponDelivery.fromValue",
                "discountCouponDelivery.dateStart",
                "discountCouponDelivery.dateEnd",
                "discountCouponDelivery.companyId",
                "company.fantasyName"
            )
            ->orderByDesc("userDiscountCouponDelivery.id")
            ->get();
    }
}
