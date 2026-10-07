<?php


namespace App\Repositories\Route;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Route\CorporateRouteCustomer;

class CorporateRouteCustomerRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(CorporateRouteCustomer::class);
    }

    public function findCustomerByCompany($document, $companyId)
    {
        return $this->getModel()
            ::where("document", $document)
            ->where("companyId", $companyId)
            ->where("statusId", StatusConst::ACTIVE)
            ->first();
    }

    public function listByCompany($companyId)
    {
        return $this->getModel()
            ::where("companyId", $companyId)
            ->where("statusId", StatusConst::ACTIVE)
            ->get();
    }

}
