<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 01/10/2019
 * Time: 14:35
 */

namespace App\Repositories\Report;


use App\Constants\Balance\BalanceFlowConst;
use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Balance\BalanceFlow;
use App\Models\Role\Role;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Query\JoinClause;

class BalanceFlowReportRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(BalanceFlow::class);
    }

    public function indicationsCommissions(array $queryRequest = [], Role $authRole = null)
    {
        return $this->getModel()
            ::where('balanceFlowTypeId', BalanceFlowConst::BONUS_MONETIZATION)
            ->join(
                'user_indication_view',
                'user_indication_view.balanceId',
                '=',
                'balanceFlow.balanceId')
            ->join('user', 'whoIndicatedId', '=', 'idUser')
            ->selectRaw("
                DISTINCT idUser,
                name,
                userType,
                ROUND(SUM(balanceFlow.value), 2) AS total,
                CONCAT(DATE_FORMAT(MIN(balanceFlow.date),'%d/%m/%Y'), ' ~ ', DATE_FORMAT(MAX(balanceFlow.date),'%d/%m/%Y')) AS period
            ")
            ->groupBy('idUser', 'userType')
            ->when(isset($queryRequest['userId']), function (Builder $query) use ($queryRequest) {
                $query
                    ->where('idUser', $queryRequest['userId']);
            })
            ->when(isset($queryRequest['dateStart']), function (Builder $query) use ($queryRequest) {
                $query
                    ->where(
                        'balanceFlow.date',
                        '>=',
                        Carbon::parse($queryRequest['dateStart'])->startOfDay());
            })
            ->when(isset($queryRequest['dateEnd']), function (Builder $query) use ($queryRequest) {
                $query
                    ->where(
                        'balanceFlow.date',
                        '<=',
                        Carbon::parse($queryRequest['dateEnd'])->endOfDay());
            })
            ->when(isset($authRole) && !$authRole->support, function (Builder $query) use ($authRole) {
                $query->leftJoin('driver', 'user.idUser', 'driver.userId')
                    ->join('cityArea', function (JoinClause $join) use ($authRole) {
                        $join->where('cityArea.statusId', StatusConst::ACTIVE)
                            ->whereIn('cityArea.cityId', function (\Illuminate\Database\Query\Builder $query) use ($authRole) {
                                $query->select('cityId')
                                    ->from('roleCity')
                                    ->where('roleId', $authRole->id);
                            })
                            ->whereRaw('(
                            if(user_indication_view.isDriver, driver.cityId = cityArea.cityId,
                               (user.cityId = cityArea.cityId or ST_CONTAINS(cityArea.polygon,
                                                                             POINT(user.last_lat, user.last_lon))))
                            )');
                    });
            })
            ->get();
    }

    public function voucherMovements(array $request = [], Role $authRole = null)
    {
        return $this->getModel()
            ::orderByDesc('date')
            ->join('balanceFlowType', 'balanceFlowTypeId', '=', 'idBalanceFlowType')
            ->join('balance', 'balanceFlow.balanceId', '=', 'idBalance')
            ->join('customer', 'customer.balanceId', '=', 'idBalance')
            ->join('user', 'customer.userId', '=', 'user.idUser')
            ->leftJoin('user as responsibleUser', 'balanceFlow.responsibleUserId', '=', 'responsibleUser.idUser')
            ->whereIn('balanceFlow.balanceFlowTypeId', array_map(function ($item) {
                return $item['id'];
            }, BalanceFlowConst::VOUCHER_MOVEMENTS))
            ->when(isset($request['dateStart']), function (Builder $query) use ($request) {
                $query
                    ->where(
                        'balanceFlow.date',
                        '>=',
                        Carbon::parse($request['dateStart'])->startOfDay());
            })
            ->when(isset($request['dateEnd']), function (Builder $query) use ($request) {
                $query
                    ->where(
                        'balanceFlow.date',
                        '<=',
                        Carbon::parse($request['dateEnd'])->endOfDay());
            })
            ->when(isset($request['userId']), function (Builder $query) use ($request) {
                $query
                    ->where('user.idUser', $request['userId']);
            })
            ->when(isset($request['balanceFlowTypeId']), function (Builder $query) use ($request) {
                $query
                    ->where('balanceFlow.balanceFlowTypeId', $request['balanceFlowTypeId']);
            })
            ->when(!$authRole->support, function (Builder $query) use ($authRole) {
                $query->join('cityArea', function (JoinClause $join) use ($authRole) {
                    $join->where('cityArea.statusId', StatusConst::ACTIVE)
                        ->whereIn('cityArea.cityId', function (\Illuminate\Database\Query\Builder $query) use ($authRole) {
                            $query->select('cityId')
                                ->from('roleCity')
                                ->where('roleCity.roleId', $authRole->id);
                        })
                        ->where(function (\Illuminate\Database\Query\Builder $query) {
                            $query->whereColumn('user.cityId', 'cityArea.cityId')
                                ->orWhereRaw('(ST_CONTAINS(cityArea.polygon, POINT(user.last_lat, user.last_lon)))');
                        });
                });
            })
            ->select(
                'balanceFlow.date',
                'balanceFlow.value',
                'balanceFlowType.name AS balanceFlowType',
                'balanceFlowType.flow',
                'user.name',
                'user.phone',
                'user.email',
                'responsibleUser.name as responsible_name',
                'responsibleUser.email as responsible_email'
            )
            ->get();
    }

    public function voucherMovementsByCentral(array $request = [], Role $authRole = null)
    {
        return $this->getModel()
            ::orderByDesc('date')
            ->join('balanceFlowType', 'balanceFlowTypeId', '=', 'idBalanceFlowType')
            ->join('balance', 'balanceFlow.balanceId', '=', 'idBalance')
            ->leftJoin('trip', 'trip.tripReference', '=', 'balanceFlow.tripReference')
            ->leftJoin('user', 'trip.userId', '=', 'user.idUser')
            ->leftJoin('central as c', 'c.balanceId', '=', 'idBalance')
            ->join('user as u','u.idUser', '=', 'c.responsibleId')
            ->whereIn('balanceFlow.balanceFlowTypeId', array_map(function ($item) {
                return $item['id'];
            }, BalanceFlowConst::VOUCHER_MOVEMENTS_CENTRAL))
            ->when(isset($request['dateStart']), function (Builder $query) use ($request) {
                $query
                    ->where(
                        'balanceFlow.date',
                        '>=',
                        Carbon::parse($request['dateStart'])->startOfDay());
            })
            ->when(isset($request['dateEnd']), function (Builder $query) use ($request) {
                $query
                    ->where(
                        'balanceFlow.date',
                        '<=',
                        Carbon::parse($request['dateEnd'])->endOfDay());
            })
            ->when(isset($request['userId']), function (Builder $query) use ($request) {
                $query
                    ->where('idUser', $request['userId']);
            })
            ->when(isset($request['balanceFlowTypeId']), function (Builder $query) use ($request) {
                $query
                    ->where('balanceFlow.balanceFlowTypeId', $request['balanceFlowTypeId']);
            })
            ->when(isset($request['centralId']), function (Builder $query) use ($request) {
                $query->where(function ($query) use ($request) {
                    if ($request['balanceFlowTypeId'] == BalanceFlowConst::VOUCHER_EXIT_RUNNING) {
                        $query->where('trip.centralId', $request['centralId']);
                    }

                    if ($request['balanceFlowTypeId'] == BalanceFlowConst::VOUCHER_BONUS ||
                        $request['balanceFlowTypeId'] == BalanceFlowConst::VOUCHER_PURCHASE_CENTRAL) {
                        $query->leftJoin('central as c', 'c.balanceId', '=', 'balance.idBalance')
                            ->where('c.id', $request['centralId']);
                    }

                    if ($request['balanceFlowTypeId'] == '') {
                        $query->where(function($query) use ($request) {
                            $query->where('trip.centralId', $request['centralId'])
                                ->orWhereIn('balanceFlow.balanceFlowTypeId', array_map(function ($item) {
                                    return $item['id'];
                                }, BalanceFlowConst::VOUCHER_MOVEMENTS_CENTRAL));
                        })
                        ->where('c.id', $request['centralId']);
                    }
                });
            })
            ->when(!$authRole->support, function (Builder $query) use ($authRole) {
                $query->join('cityArea', function (JoinClause $join) use ($authRole) {
                    $join->where('cityArea.statusId', StatusConst::ACTIVE)
                        ->whereIn('cityArea.cityId', function (\Illuminate\Database\Query\Builder $query) use ($authRole) {
                            $query->select('cityId')
                                ->from('roleCity')
                                ->where('roleCity.roleId', $authRole->id);
                        })
                        ->where(function (\Illuminate\Database\Query\Builder $query) {
                            $query->whereColumn('user.cityId', 'cityArea.cityId')
                                ->orWhereRaw('(ST_CONTAINS(cityArea.polygon, POINT(user.last_lat, user.last_lon)))');
                        });
                });
            })
            ->select(
                'balanceFlow.date',
                'balanceFlow.value',
                'balanceFlowType.name AS balanceFlowType',
                'balanceFlowType.flow',
                'user.name',
                'user.phone',
                'user.email',
                'c.name AS centralName',
                'u.email AS responsibleEmail',
                'u.phone AS responsiblePhone'
            )
            ->get();
    }

    public function driverBalanceMovements(array $request = [], Role $authRole = null)
    {
        return $this->getModel()
            ::orderByDesc('date')
            ->join('balanceFlowType', 'balanceFlowTypeId', '=', 'idBalanceFlowType')
            ->join('balance', 'balanceFlow.balanceId', '=', 'idBalance')
            ->join('driver', 'driver.balanceId', '=', 'idBalance')
            ->join('user', 'driver.userId', '=', 'user.idUser')
            ->leftJoin('user as responsibleUser', 'balanceFlow.responsibleUserId', '=', 'responsibleUser.idUser')
            ->whereIn('balanceFlow.balanceFlowTypeId', [34, 71]) // BÔNUS EM SALDO e INCLUSÃO DE DÉBITO (MANUAL)
            ->when(isset($request['dateStart']), function (Builder $query) use ($request) {
                $query->where(
                    'balanceFlow.date',
                    '>=',
                    Carbon::parse($request['dateStart'])->startOfDay()
                );
            })
            ->when(isset($request['dateEnd']), function (Builder $query) use ($request) {
                $query->where(
                    'balanceFlow.date',
                    '<=',
                    Carbon::parse($request['dateEnd'])->endOfDay()
                );
            })
            ->when(isset($request['userId']), function (Builder $query) use ($request) {
                $query->where('user.idUser', $request['userId']);
            })
            ->when(isset($request['balanceFlowTypeId']), function (Builder $query) use ($request) {
                $query->where('balanceFlow.balanceFlowTypeId', $request['balanceFlowTypeId']);
            })
            ->when(isset($request['driverId']), function (Builder $query) use ($request) {
                $query->where('driver.idDriver', $request['driverId']);
            })
            ->when(isset($request['cityId']), function (Builder $query) use ($request) {
                $query->where('user.cityId', $request['cityId']);
            })
            ->when(!$authRole->support, function (Builder $query) use ($authRole) {
                $query->join('cityArea', function (JoinClause $join) use ($authRole) {
                    $join->where('cityArea.statusId', StatusConst::ACTIVE)
                        ->whereIn('cityArea.cityId', function (\Illuminate\Database\Query\Builder $query) use ($authRole) {
                            $query->select('cityId')
                                ->from('roleCity')
                                ->where('roleCity.roleId', $authRole->id);
                        })
                        ->whereColumn('user.cityId', 'cityArea.cityId');
                });
            })
            ->select(
                'balanceFlow.idBalanceFlow as id',
                'balanceFlow.date',
                'balanceFlow.value as amount',
                'driver.idDriver as driver_id',
                'user.name as driver_name',
                'user.email as driver_email',
                'user.phone as driver_phone',
                'user.cityId as driver_city_id',
                'balanceFlow.responsibleUserId as responsible_user_id',
                'responsibleUser.name as responsible_user_name',
                'responsibleUser.email as responsible_user_email',
                'balanceFlowType.name as operation_type',
                'balanceFlowType.flow'
            )
            ->get();
    }
}
