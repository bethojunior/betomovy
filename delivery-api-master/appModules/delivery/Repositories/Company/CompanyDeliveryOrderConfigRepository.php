<?php


namespace Delivery\Repositories\Company;


use App\Contracts\Repository\AbstractRepository;
use Delivery\Models\Company\CompanyDeliveryOrderConfig;

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
