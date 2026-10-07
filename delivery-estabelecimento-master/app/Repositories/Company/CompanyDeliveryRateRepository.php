<?php


namespace App\Repositories\Company;


use App\Constants\StatusConst;
use App\Models\Company\CompanyDeliveryRate;
use Common\Contracts\Repository\AbstractRepository;

class CompanyDeliveryRateRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(CompanyDeliveryRate::class);
    }

    public function feeAlreadyExists($companyId, $range)
    {
        return $this->getModel()
            ::where("companyId",$companyId)
            ->where("range",$range)
            ->where("statusId",StatusConst::ACTIVE)
            ->first();
    }


    public function findByCompany($companyId)
    {
        return $this->getModel()
            ::where("companyId",$companyId)
            ->where("statusId",StatusConst::ACTIVE)
            ->orderBy("range","ASC")
            ->get();
    }
}
