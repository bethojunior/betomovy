<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/06/2019
 * Time: 17:51
 */

namespace App\Repositories\Trip;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Trip\DriverCommission;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DriverCommissionRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(DriverCommission::class);
    }

    public function findByCityAndTripType($cityId, $tripTypeId)
    {
        return $this->getModel()
            ::where('cityId', $cityId)
            ->where('tripTypeId', $tripTypeId)
            ->where('statusId', StatusConst::ACTIVE)
            ->first([
                'idDriverCommission',
                'value',
                'valueType',
                'cityId',
                'tripTypeId',
                'statusId'
            ]);
    }

    public function removeInCityByTripType(int $cityId, int $tripTypeId): bool
    {
        return (bool) $this->getModel()
            ::where('cityId', $cityId)
            ->where('tripTypeId', $tripTypeId)
            ->where('statusId', StatusConst::ACTIVE)
            ->update(['statusId' => StatusConst::REMOVED]);
    }

    public function findByCity($cityId): Collection
    {
        return $this->getModel()
            ::where('cityId', $cityId)
            ->where('statusId', StatusConst::ACTIVE)
            ->whereHas('tripType', function (Builder $query) {
                $query
                    ->where('statusId', StatusConst::ACTIVE);
            })
            ->with(['commissionAnotherFee', 'commissionsPaymentForm'])
            ->get();
    }

    public function disableInCity($cityId)
    {
        return $this->getModel()
            ::where('cityId', $cityId)
            ->where('statusId', StatusConst::ACTIVE)
            ->update(['statusId' => StatusConst::REMOVED]);
    }
}
