<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 27/11/2019
 * Time: 17:55
 */

namespace App\Repositories\Route;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Route\Route;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RouteRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(Route::class);
    }

    public function findAll(array $request = [])
    {
        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->with([
                'origin',
                'destination',
                'routeWayPoints' => function (HasMany $query) {
                    $query
                        ->select(
                            'routeWayPoint.id',
                            'routeId',
                            'routePitStopId',
                            'routePitStopTypeId',
                            'routePitStopType.name AS routePitStopType')
                        ->join('routePitStopType', 'routePitStopType.id', '=', 'routePitStopTypeId')
                        ->where("statusId", StatusConst::ACTIVE)
                        ->with('routePitStop');
                },
                'routeTripItemTypes' => function (HasMany $query) {
                    $query
                        ->with('tripItemType');
                },
            ])
            ->orderByDesc('active')
            ->orderByDesc('created_at')
            ->when(isset($request['cityId']), function (Builder $query) use ($request) {
                $query
                    ->where('cityId', $request['cityId']);
            })
            ->when(isset($request['active']), function (Builder $query) use ($request) {
                $query
                    ->where('active', $request['active']);
            })
            ->when(isset($request['tripTypeId']), function (Builder $query) use ($request) {
                $query
                    ->where('tripTypeId', $request['tripTypeId']);
            })
            ->when((isset($request['page']) && $request['paginate'] == 1),
                function (Builder $query){
                    return
                        $query->paginate();
                },
                function (Builder $query) {
                    return $query->get();
                });
    }

    public function findById($id)
    {
        return $this->getModel()
            ::where('id', $id)
            ->with([
                'origin',
                'destination',
                'routeWayPoints' => function (HasMany $query) {
                    $query
                        ->select(
                            'routeWayPoint.id',
                            'routeId',
                            'routePitStopId',
                            'routePitStopTypeId',
                            'routePitStopType.name AS routePitStopType')
                        ->join('routePitStopType', 'routePitStopType.id', '=', 'routePitStopTypeId')
                        ->where("statusId", StatusConst::ACTIVE)
                        ->with('routePitStop');
                },
                'routeTripItemTypes' => function (HasMany $query) {
                    $query
                        ->with('tripItemType');
                },
            ])->first();
    }
}
