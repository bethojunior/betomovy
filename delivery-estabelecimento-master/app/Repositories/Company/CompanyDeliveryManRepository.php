<?php


namespace App\Repositories\Company;


use App\Constants\StatusConst;
use App\Models\Company\CompanyDeliveryMan;
use Common\Contracts\Repository\AbstractRepository;

class CompanyDeliveryManRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(CompanyDeliveryMan::class);
    }

    public function findDeliveryManInCompany($driverId, $companyId)
    {
        return $this->getModel()
            ::where('companyId', $companyId)
            ->where("driverId", $driverId)
            ->where("statusId", StatusConst::ACTIVE)
            ->first();

    }

    public function findDeliveryManByCompanyId($companyId)
    {
        return $this->getModel()
            ::where("companyId", $companyId)
            ->where("statusId", StatusConst::ACTIVE)
            ->with(["driver" => function ($query) {
                return $query->with("user");
            }])->get();
    }
}
