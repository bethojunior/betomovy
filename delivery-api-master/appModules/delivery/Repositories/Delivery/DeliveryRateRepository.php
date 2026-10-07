<?php


namespace Delivery\Repositories\Delivery;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use Delivery\Models\Delivery\DeliveryRate;

class DeliveryRateRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(DeliveryRate::class);
    }

    public function calculate($lat, $lng, $companyId)
    {
        return $this->getModel()
            ::where("deliveryRate.statusId", StatusConst::ACTIVE)
            ->where("cityArea.statusId",StatusConst::ACTIVE)
            ->join('companyAddress', 'companyAddress.companyId', '=', \DB::raw($companyId))
            ->join('cityArea', 'cityArea.cityId', '=', 'deliveryRate.cityId')
            ->select(
                [
                    'deliveryRate.id',
                    "deliveryRate.range",
                    "deliveryRate.tax",
                    "deliveryRate.time"
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
            ->whereRaw('ST_CONTAINS(cityArea.polygon, ST_GeomFromText(ST_AsText(point(?, ?))))', [$lat, $lng])
            ->havingRaw('deliveryRate.range >= proximity')
            ->orderBy("deliveryRate.range", "ASC")
            ->first();
    }
}
