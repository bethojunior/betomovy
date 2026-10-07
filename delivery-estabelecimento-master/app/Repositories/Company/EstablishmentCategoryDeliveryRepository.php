<?php


namespace App\Repositories\Company;


use App\Constants\StatusConst;
use App\Models\Company\EstablishmentCategoryDelivery;
use Common\Contracts\Repository\AbstractRepository;

class EstablishmentCategoryDeliveryRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(EstablishmentCategoryDelivery::class);
    }

    public function findByCompany($companyId)
    {
        return $this->getModel()
            ::where('companyId',$companyId)
            ->where('statusId',StatusConst::ACTIVE)
            ->get();
    }
}
