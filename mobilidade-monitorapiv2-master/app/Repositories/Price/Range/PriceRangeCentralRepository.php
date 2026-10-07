<?php

namespace App\Repositories\Price\Range;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Price\Range\PriceRangeCentral;
use Illuminate\Database\Eloquent\Builder;

class PriceRangeCentralRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(PriceRangeCentral::class);
    }

    public function findAll(array $queryRequest = [])
    {
        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->with([
                'city',
                'tripType',
                'centrals' => function ($query) {
                    $query->select(['central.id', 'central.name']);
                }
            ])
            ->when(isset($queryRequest['cityId']), function (Builder $query) use ($queryRequest) {
                $query
                    ->where('cityId', $queryRequest['cityId']);
            })
            ->when(isset($queryRequest['tripTypeId']), function (Builder $query) use ($queryRequest) {
                $query
                    ->where('tripTypeId', $queryRequest['tripTypeId']);
            })
            ->orderByDesc('id')
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

    public function findByParamsForValidation(array $params = [])
    {
        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->when(isset($params['cityId']), function (Builder $query) use ($params) {
                $query
                    ->where('cityId', $params['cityId']);
            })
            ->when(isset($params['tripTypeId']), function (Builder $query) use ($params) {
                $query
                    ->where('tripTypeId', $params['tripTypeId']);
            })
            ->when(isset($params['min_value']), function (Builder $query) use ($params) {
                $query
                    ->whereRaw("? BETWEEN min_value AND max_value", [$params['min_value']]);
            })
            ->when(isset($params['max_value']), function (Builder $query) use ($params) {
                $query
                    ->whereRaw("? BETWEEN min_value AND max_value", [$params['max_value']]);
            })
            ->when(isset($params['id']), function (Builder $query) use ($params) {
                $query
                    ->whereKeyNot($params['id']);
            })
            ->get();
    }
}
