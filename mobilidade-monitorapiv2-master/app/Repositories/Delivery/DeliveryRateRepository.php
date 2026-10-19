<?php


namespace App\Repositories\Delivery;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Delivery\DeliveryRate;

class DeliveryRateRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(DeliveryRate::class);
    }

    public function feeAlreadyExists($range, $cityId)
    {
        return $this->getModel()
            ::where("statusId", StatusConst::ACTIVE)
            ->where("range", $range)
            ->where("cityId", $cityId)
            ->first();
    }

    public function getAll($cityId = null)
    {
        return $this->getModel()
            ::where("statusId", StatusConst::ACTIVE)
            ->when($cityId, function ($query) use ($cityId) {
                return $query->where("cityId", $cityId);
            })
            ->get();
    }

}
