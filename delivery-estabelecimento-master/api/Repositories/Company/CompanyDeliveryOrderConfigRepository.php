<?php


namespace Api\Repositories\Company;


use Common\Contracts\Repository\AbstractRepository;
use Common\Models\Config\CompanyDeliveryOrderConfig;

class CompanyDeliveryOrderConfigRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(CompanyDeliveryOrderConfig::class);
    }

    public function findByCompany($companyId)
    {
        return $this->getModel()
            ::where("companyId", $companyId)
            ->first();
    }
}
