<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/12/2019
 * Time: 18:56
 */

namespace App\Repositories\Price\Dynamic;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Price\Dynamic\PriceDynamicScheduled;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class PriceDynamicScheduledRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(PriceDynamicScheduled::class);
    }

    public function findAll(array $request = [], int $cityId = null): Collection
    {
        return $this->getModel()::query()->join('city', 'priceDynamicScheduled.cityId', 'city.id')
            ->join('tripType', 'priceDynamicScheduled.tripTypeId', 'tripType.idTripType')
            ->select(
                'priceDynamicScheduled.id',
                'priceDynamicScheduled.cityId',
                'city.nome as city',
                'priceDynamicScheduled.tripTypeId',
                'tripType.type as tripType',
                'multiplierValue',
                'tag',
                'startDate',
                'endDate',
                'priceDynamicScheduled.statusId'
            )
            ->where('priceDynamicScheduled.statusId', StatusConst::ACTIVE)
            ->where('priceDynamicScheduled.endDate', '>', Carbon::now())
            ->when(isset($cityId), function (Builder $query) use ($cityId) {
                $query->where('priceDynamicScheduled.cityId', $cityId);
            })
            ->get();
    }

    public function findByCity($cityId)
    {
        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->where('cityId', $cityId)
            ->get();
    }

    public function disableInCity($cityId)
    {
        return $this->getModel()
            ::where('cityId', $cityId)
            ->where('statusId', StatusConst::ACTIVE)
            ->update(['statusId' => StatusConst::REMOVED]);
    }

    public function show(int $id)
    {
        return $this->getModel()
            ::where('id', $id)
            ->where('statusId', StatusConst::ACTIVE)
            ->firstOrFail();
    }

}
