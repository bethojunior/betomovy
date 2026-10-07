<?php


namespace Delivery\Repositories\Company;


use App\Contracts\Repository\AbstractRepository;
use Delivery\Models\Company\CompanyDeliveryConfig;

class CompanyDeliveryConfigRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(CompanyDeliveryConfig::class);
    }

    public function findByCompany($companyId)
    {
        return $this->getModel()
            ::where('companyId', $companyId)
            ->first();
    }
}
