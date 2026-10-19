<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/06/2019
 * Time: 20:09
 */

namespace App\Repositories\Central;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Central\Price;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class PriceRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(Price::class);
    }

    public function findAll(array $request = [], int $cityId = null): Collection
    {
        $targetCityId = null;
        if (isset($request['cityId']) && is_numeric($request['cityId']) && (int)$request['cityId'] > 0) {
            $targetCityId = (int)$request['cityId'];
        } elseif (!is_null($cityId) && $cityId > 0) {
            $targetCityId = $cityId;
        }

        return $this->getModel()::when(!is_null($targetCityId), function (Builder $query) use ($targetCityId) {
            $query->where('price.cityId', $targetCityId);
        })
            ->where('price.statusId', StatusConst::ACTIVE)
            ->with('tripType')
            ->orderBy('price.cityId')
            ->orderByRaw('price.`order` IS NULL, price.`order` ASC')
            ->orderBy('price.tripTypeId')
            ->get();
    }

    /**
     * @param $centralId
     * @return \Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model[]|\Illuminate\Support\Collection
     */
    public function findByCentral($centralId)
    {
        return $this->getModel()
            ::where('centralId', $centralId)
            ->where('statusId', StatusConst::ACTIVE)
            ->orderBy('tripTypeId')
            ->get();
    }

    public function findByCity($cityId)
    {
        return $this->getModel()
            ::where('cityId', $cityId)
            ->where('statusId', StatusConst::ACTIVE)
            ->whereHas('tripType', function (Builder $query) {
                $query
                    ->where('statusId', StatusConst::ACTIVE);
            })
            ->orderByRaw('price.`order` IS NULL, price.`order` ASC')
            ->orderBy('price.tripTypeId')
            ->get();
    }

    public function disableInCity($cityId)
    {
        return $this->getModel()
            ::where('cityId', $cityId)
            ->where('statusId', StatusConst::ACTIVE)
            ->update(['statusId' => StatusConst::REMOVED]);
    }

    /**
     * Preço ativo para cidade e tipo de viagem (usado para preservar campos como `order` ao recriar registro).
     */
    public function findActiveByCityAndTripType(int $cityId, int $tripTypeId): ?Price
    {
        return $this->getModel()::query()
            ->where('cityId', $cityId)
            ->where('tripTypeId', $tripTypeId)
            ->where('statusId', StatusConst::ACTIVE)
            ->first();
    }

    public function removeInCityByTripType(int $cityId, int $tripTypeId): bool
    {
        return $this->getModel()::query()->where('cityId', $cityId)
            ->where('tripTypeId', $tripTypeId)
            ->where('statusId', StatusConst::ACTIVE)
            ->update([
                'statusId' => StatusConst::REMOVED
            ]);
    }

    public function updateOrder(int $cityId, array $orders): bool
    {
        DB::beginTransaction();
        
        try {
            foreach ($orders as $orderData) {
                $this->getModel()::where('id', $orderData['id'])
                    ->where('cityId', $cityId)
                    ->where('statusId', StatusConst::ACTIVE)
                    ->update(['order' => $orderData['order']]);
            }
            
            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
