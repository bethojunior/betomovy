<?php


namespace Delivery\Repositories\Delivery;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use Delivery\Models\Delivery\PayMachineReturn;

class PayMachineReturnRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(PayMachineReturn::class);
    }

    public function findByCity($cityId)
    {
        return $this->getModel()
            ::where("cityId",$cityId)
            ->where("statusId",StatusConst::ACTIVE)
            ->first();
    }
}
