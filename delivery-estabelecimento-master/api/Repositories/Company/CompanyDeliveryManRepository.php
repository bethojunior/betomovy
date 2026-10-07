<?php


namespace Api\Repositories\Company;


use Common\Constants\StatusConst;
use Common\Contracts\Repository\AbstractRepository;
use Common\Models\Company\CompanyDeliveryMan;

class CompanyDeliveryManRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(CompanyDeliveryMan::class);
    }


    public function findDeliveryManByCompanyId($companyId)
    {
        return $this->getModel()
            ::where("companyId", $companyId)
            ->where("statusId",StatusConst::ACTIVE)
            ->with(["driver"=>function ($query){
                return $query->with("user");
            }])->get();
    }


    public function findDeliveryManActiveByCompanyId($companyId)
    {
        return $this->getModel()
            ::where("companyId", $companyId)
            ->where("statusId", StatusConst::ACTIVE)
            ->whereHas('driver', function ($query) {
                return $query->where("status", "disponivel");
            })
            ->with(["driver" => function ($query) {
                return $query->with("user");
            }])->get();
    }
}
