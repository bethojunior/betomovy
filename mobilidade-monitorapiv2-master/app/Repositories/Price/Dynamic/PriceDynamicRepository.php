<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 16/10/2019
 * Time: 13:49
 */

namespace App\Repositories\Price\Dynamic;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Price\Dynamic\PriceDynamic;
use Illuminate\Database\Eloquent\Builder;

class PriceDynamicRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(PriceDynamic::class);
    }

    public function findAll(array $queryRequest = [])
    {
        $callbackCityId = function (Builder $query) use ($queryRequest) {
            $query
                ->where('cityId', $queryRequest['cityId']);
        };

        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->with([
                'city',
                'weekDay',
                'tripType' => function ($query) {
                    $query
                        ->select(
                            'idTripType',
                            'type',
                            'picture'
                        );
                }
            ])
            ->when(isset($queryRequest['cityId']), $callbackCityId)
            ->orderByDesc('active')
            ->orderBy('dayOfWeek')
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
            ->when(isset($params['dayOfWeek']), function (Builder $query) use ($params) {
                $query
                    ->where('dayOfWeek', $params['dayOfWeek']);
            })
            ->when(isset($params['timeStart']), function (Builder $query) use ($params) {
                $query
                    ->whereRaw("? BETWEEN timeStart AND timeEnd", [$params['timeStart']]);
            })
            ->when(isset($params['timeEnd']), function (Builder $query) use ($params) {
                $query
                    ->whereRaw("? BETWEEN timeStart AND timeEnd", [$params['timeEnd']]);
            })
            ->get();
    }

    public function findById($id)
    {
        return $this->getModel()
            ::where('idPriceDynamic', $id)
            ->with([
                'city',
                'weekDay',
                'tripType' => function ($query) {
                    $query
                        ->select(
                            'idTripType',
                            'type',
                            'picture'
                        );
                }
            ])
            ->where('statusId', StatusConst::ACTIVE)
            ->orderByDesc('active')
            ->orderBy('dayOfWeek')
            ->first();
    }
}
