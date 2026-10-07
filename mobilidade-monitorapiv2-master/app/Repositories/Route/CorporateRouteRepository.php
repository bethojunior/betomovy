<?php


namespace App\Repositories\Route;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Route\CorporateRoute;

class CorporateRouteRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(CorporateRoute::class);
    }

    public function findAll()
    {
        return $this->getModel()
            ::where("statusId", StatusConst::ACTIVE)
            ->orderByDesc('created_at')
            ->get();

    }

    public function findCompanyByCorporateRoute($companyId, $routeId)
    {
        return $this->getModel()
            ::where("companyId", $companyId)
            ->where("routeId", $routeId)
            ->where("statusId", StatusConst::ACTIVE)
            ->orderByDesc('created_at')
            ->first();
    }


    public function findCompaniesByRoute($routeId)
    {
        return $this->getModel()
            ::where("routeId", $routeId)
            ->where("statusId", StatusConst::ACTIVE)
            ->with("company")
            ->orderByDesc('created_at')
            ->get();
    }

    public function findRouteByCompany($companyId)
    {
        return $this->getModel()
            ::where("companyId", $companyId)
            ->where("statusId", StatusConst::ACTIVE)
            ->with("route")
            ->orderByDesc('created_at')
            ->get();
    }
}
