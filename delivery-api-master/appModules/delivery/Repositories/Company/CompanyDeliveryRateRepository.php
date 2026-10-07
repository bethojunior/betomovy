<?php


namespace Delivery\Repositories\Company;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use Delivery\Models\Company\CompanyDeliveryRate;

class CompanyDeliveryRateRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(CompanyDeliveryRate::class);
    }

    public function calculate($lat, $lng, $companyId)
    {
        return $this->getModel()
            ::where("statusId", StatusConst::ACTIVE)
            ->join('companyAddress', 'companyAddress.companyId', '=', 'companyDeliveryRate.companyId')
            ->select(
                [
                    "companyDeliveryRate.range",
                    "companyDeliveryRate.tax",
                    "companyDeliveryRate.time"
                ]
            )
            ->selectRaw("
                ROUND((6371 * acos(
                     cos( radians(companyAddress.latitude) )
                     * cos( radians( ? ) )
                     * cos( radians( ? ) - radians(companyAddress.longitude) )
                     + sin( radians(companyAddress.latitude) )
                     * sin( radians( ? ) )
                    )
                ), 2) AS proximity
            ", [$lat, $lng, $lat])
            ->where("companyDeliveryRate.companyId", $companyId)
            ->where("companyDeliveryRate.statusId", StatusConst::ACTIVE)
            ->havingRaw('companyDeliveryRate.range >= proximity')
            ->orderBy("companyDeliveryRate.range", "ASC")
            ->first();
    }
}
