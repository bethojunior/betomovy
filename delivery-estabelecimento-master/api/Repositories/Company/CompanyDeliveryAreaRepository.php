<?php


namespace Api\Repositories\Company;


use App\Constants\StatusConst;
use App\Models\Company\CompanyDeliveryArea;
use Common\Contracts\Repository\AbstractRepository;

class CompanyDeliveryAreaRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(CompanyDeliveryArea::class);
    }

    public function findAll($companyId)
    {
        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->where('companyId', $companyId)
            ->select([
                'id'
            ])
            ->selectRaw('ST_AsText(area) AS area')
            ->get();
    }
}
