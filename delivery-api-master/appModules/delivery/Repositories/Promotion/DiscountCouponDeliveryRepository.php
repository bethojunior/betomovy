<?php


namespace Delivery\Repositories\Promotion;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use Delivery\Models\Promotion\DiscountCouponDelivery;

class DiscountCouponDeliveryRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(DiscountCouponDelivery::class);
    }

    public function findCouponByCode(string $code)
    {
        return $this->getModel()
            ::where("code", $code)
            ->where("statusId", StatusConst::ACTIVE)
            ->whereRaw("(NOW() BETWEEN dateStart AND dateEnd)", [])
            ->first();
    }


}
