<?php


namespace Delivery\Repositories\Company;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use Delivery\Models\Company\CompanyDeliveryArea;
use Illuminate\Database\Eloquent\Builder;

class CompanyDeliveryAreaRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(CompanyDeliveryArea::class);
    }

    public function getDeliverAreaByCompany($lat, $lng, $companyId)
    {
        return $this->getModel()
            ::where("companyId", $companyId)
            ->whereRaw('ST_CONTAINS(area, ST_GeomFromText(ST_AsText(point(?, ?))))', [$lat, $lng])
            ->where("statusId", StatusConst::ACTIVE)
            ->first();
    }
}
