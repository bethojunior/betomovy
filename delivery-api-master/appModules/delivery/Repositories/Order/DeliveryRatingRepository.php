<?php


namespace Delivery\Repositories\Order;


use App\Contracts\Repository\AbstractRepository;
use Delivery\Models\Order\DeliveryRating;
use Illuminate\Support\Facades\DB;

class DeliveryRatingRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(DeliveryRating::class);
    }

    public function findByOrder($deliveryOrderId)
    {
        return $this->getModel()
            ::where('deliveryOrderId', $deliveryOrderId)
            ->first();
    }

    /**
     * @param $companyId
     * @return array
     */
    public function calculateRating($companyId)
    {
        return DB::select('SELECT (((50 - COUNT(dR.ratingOfTheEstablishment)) * 5) + SUM(dR.ratingOfTheEstablishment)) / 50 AS avg
                    FROM deliveryRating dR
                    WHERE dR.companyId = ? ORDER BY id DESC
                    LIMIT 50', [$companyId])[0];
    }
}
