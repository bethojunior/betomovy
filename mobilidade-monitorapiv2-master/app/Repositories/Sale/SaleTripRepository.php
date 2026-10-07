<?php

namespace App\Repositories\Sale;

use App\Contracts\Repository\AbstractRepository;
use App\Models\Sale\SaleTrip;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

class SaleTripRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(SaleTrip::class);
    }

    public function findAll(array $request = [], int $cityId = null, bool $isSupport = false)
    {
        return $this->getModel()::when(!$isSupport && isset($cityId), function (Builder $query) use ($cityId) {
            $query->where('saleTrip.cityId', $cityId);
        })
            ->leftJoin('discountCoupon', 'saleTrip.id', '=', 'discountCoupon.saleTripId')
            ->select([
                'discountCoupon.tripPaymentFormId',
                'saleTrip.*',
            ])
            ->get();
    }
}
