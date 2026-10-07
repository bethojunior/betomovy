<?php


namespace App\Repositories\Route;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Route\ScheduleCorporateRouteCustomer;

class ScheduleCorporateRouteCustomerRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(ScheduleCorporateRouteCustomer::class);
    }

    public function findCustomer($corporateRouteCustomerId, $scheduleCorporateRouteId)
    {
        return $this->getModel()
            ::where("corporateRouteCustomerId", $corporateRouteCustomerId)
            ->where("scheduleCorporateRouteId", $scheduleCorporateRouteId)
            ->where("statusId", StatusConst::ACTIVE)
            ->first();
    }

    public function listCustomerByScheduleCorporateRouteId($scheduleCorporateRouteId)
    {
        return $this->getModel()
            ::where("scheduleCorporateRouteId", $scheduleCorporateRouteId)
            ->where("statusId", StatusConst::ACTIVE)
            ->with(["corporateRouteCustomer"])
            ->get();
    }
}
