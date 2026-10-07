<?php


namespace App\Repositories\Report\Customer;


use App\Constants\Balance\BalanceFlowTypeConst;
use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Balance\BalanceFlow;
use App\Models\ReadOnly\Driver\FavoriteDriverRO;
use App\Models\User\Customer;
use App\Models\User\RefusedDriver;
use App\Models\User\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\DB;

class CustomerReportRepository extends AbstractRepository
{

    /**
     * CustomerReportRepository constructor.
     */
    public function __construct()
    {
        $this->setModel(Customer::class);
    }

    public function findAll(array $request = [], User $authUser = null)
    {
        return $this->getModel()
            ::join('user', 'customer.userId', '=', 'idUser')
            ->join('customerRegisterStatus', 'customer.customerRegisterStatusId', '=', 'customerRegisterStatus.idCustomerRegisterStatus')
            ->join('balance', 'customer.balanceId', '=', 'balance.idBalance')
            ->leftJoin('cityArea', function (JoinClause $join) use ($request) {
                $join->where('cityArea.statusId', StatusConst::ACTIVE)
                    ->on(function (JoinClause $join) {
                        $join->on('user.cityId', 'cityArea.cityId')
                            ->orWhere(function (\Illuminate\Database\Query\Builder $query) {
                                $query->whereNull('user.cityId')
                                    ->whereRaw('(ST_CONTAINS(cityArea.polygon, POINT(user.last_lat, user.last_lon)))');
                            });
                    });
            })
            ->leftJoin('city', 'cityArea.cityId', 'city.id')
            ->where('user.statusId', StatusConst::ACTIVE)
            ->when(isset($authUser->role->support) && !$authUser->role->support, function (Builder $query) use ($authUser) {
                $query->whereIn('city.id', function (\Illuminate\Database\Query\Builder $query) use ($authUser) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleCity.roleId', $authUser->roleId);
                });
            })
            ->select(
                'user.name',
                'user.document',
                'user.phone',
                'user.email',
                'user.dateOfBirth',
                'user.created_at',
                'balance.tripBalance AS voucher',
                'customer.userId',
                'customerRegisterStatus.name AS statusCustomer',
                'city.nome as cityName',
                'user.registered_in'
            )
            ->selectSub("
                SELECT
                    COUNT(*)
                FROM trip
                    WHERE trip.userId = user.idUser AND trip.status = 'finished'
            ", 'tripsFinished')
            ->orderByDesc('user.created_at')
            ->when(isset($request['name']), function (Builder $query) use ($request) {
                $query->where('user.name', 'LIKE', "%" . $request['name'] . "%");
            })
            ->when(isset($request['dateStart']), function (Builder $query) use ($request) {
                $query->where(
                    'user.created_at', '>=', Carbon::parse($request['dateStart'])->startOfDay());
            })
            ->when(isset($request['dateEnd']), function (Builder $query) use ($request) {
                $query->where(
                    'user.created_at', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
            })
            ->when(isset($request['tripBalance']), function (Builder $query) use ($request) {
                $query->where('balance.tripBalance', $request['tripBalance']);
            })
            ->when(isset($request['customerRegisterStatusId']), function (Builder $query) use ($request) {
                $query->where('idCustomerRegisterStatus', '=', $request['customerRegisterStatusId']);
            })
            ->when(isset($request['cityId']), function (Builder $query) use ($request) {
                $query->where('city.id', '=', $request['cityId']);
            })
            ->when(isset($request['registered_in']), function (Builder $query) use ($request) {
                $query->where('user.registered_in', $request['registered_in']);
            })
            ->get();
    }

    public function findAllHasDocument(array $request = [], User $authUser = null)
    {
        
        return $this->getModel()
            ::join('user', 'customer.userId', '=', 'idUser')
            ->join('customerRegisterStatus', 'customer.customerRegisterStatusId', '=', 'customerRegisterStatus.idCustomerRegisterStatus')
            ->join('balance', 'customer.balanceId', '=', 'balance.idBalance')
            ->join('docUser', 'customer.userId', '=', 'docUser.userId')
            ->join('doc', 'docUser.docId', '=', 'doc.id')
            ->leftJoin('cityArea', function (JoinClause $join) use ($request) {
                $join->where('cityArea.statusId', StatusConst::ACTIVE)
                    ->on(function (JoinClause $join) {
                        $join->on('user.cityId', 'cityArea.cityId')
                            ->orWhere(function (\Illuminate\Database\Query\Builder $query) {
                                $query->whereNull('user.cityId')
                                    ->whereRaw('(ST_CONTAINS(cityArea.polygon, POINT(user.last_lat, user.last_lon)))');
                            });
                    });
            })
            ->leftJoin('city', 'cityArea.cityId', 'city.id')
            ->where('user.statusId', StatusConst::ACTIVE)
            ->when(isset($authUser->role->support) && !$authUser->role->support, function (Builder $query) use ($authUser) {
                $query->whereIn('city.id', function (\Illuminate\Database\Query\Builder $query) use ($authUser) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleCity.roleId', $authUser->roleId);
                });
            })
            ->select(
                'user.name',
                'user.document',
                'user.phone',
                'user.email',
                'user.dateOfBirth',
                'user.created_at',
                'balance.tripBalance AS voucher',
                'customer.userId',
                'customerRegisterStatus.name AS statusCustomer',
                'city.nome as cityName',
                'user.registered_in',
                'doc.label as docLabel',
                'docUser.text as docText'
            )
            ->selectSub("
                SELECT
                    COUNT(*)
                FROM trip
                    WHERE trip.userId = user.idUser AND trip.status = 'finished'
            ", 'tripsFinished')
            ->distinct()
            ->orderByDesc('user.created_at')
            ->when(isset($request['name']), function (Builder $query) use ($request) {
                $query->where('user.name', 'LIKE', "%" . $request['name'] . "%");
            })
            ->when(isset($request['dateStart']), function (Builder $query) use ($request) {
                $query->where(
                    'user.created_at', '>=', Carbon::parse($request['dateStart'])->startOfDay());
            })
            ->when(isset($request['dateEnd']), function (Builder $query) use ($request) {
                $query->where(
                    'user.created_at', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
            })
            ->when(isset($request['tripBalance']), function (Builder $query) use ($request) {
                $query->where('balance.tripBalance', $request['tripBalance']);
            })
            ->when(isset($request['customerRegisterStatusId']), function (Builder $query) use ($request) {
                $query->where('idCustomerRegisterStatus', '=', $request['customerRegisterStatusId']);
            })
            ->when(isset($request['cityId']), function (Builder $query) use ($request) {
                $query->where('city.id', '=', $request['cityId']);
            })
            ->when(isset($request['registered_in']), function (Builder $query) use ($request) {
                $query->where('user.registered_in', $request['registered_in']);
            })
            ->get();
    }

    public function manualVoucherInsertion(array $request, bool $isSupport = false, int $cityId = null)
    {
        return BalanceFlow::query()->join('balance', 'balanceFlow.balanceId', 'balance.idBalance')
            ->join('balanceFlowType', 'balanceFlow.balanceFlowTypeId', 'balanceFlowType.idBalanceFlowType')
            ->join('customer', 'balance.idBalance', 'customer.balanceId')
            ->join('user', 'customer.userId', 'user.idUser')
            ->leftJoin('user as user_responsible', 'balanceFlow.responsibleUserId', 'user_responsible.idUser')
            ->leftJoin('cityArea', function (JoinClause $join) {
                $join->on('cityArea.statusId', DB::raw(1))
                    ->where(function (\Illuminate\Database\Query\Builder $query) {
                        $query->where('user.cityId', 'cityArea.cityId')
                            ->orWhereRaw('ST_CONTAINS(cityArea.polygon, POINT(user.last_lat, user.last_lon))');
                    });
            })
            ->leftJoin('city', 'cityArea.cityId', 'city.id')
            ->select(
                'user.name',
                'user.phone',
                'user.email',
                'user.document',
                'city.nome as cityName',
                DB::raw("if(balanceFlow.balanceFlowTypeId = 20, balanceFlow.value, -balanceFlow.value) as value"),
                'balanceFlowType.name as balanceFlowType',
                'balanceFlow.date',
                'user_responsible.name as updated_by',
                'balance.tripBalance as voucher'
            )
            ->whereIn('balanceFlow.balanceFlowTypeId', [BalanceFlowTypeConst::VOUCHER_BONUS, BalanceFlowTypeConst::VOUCHER_BLOCKED])
            ->where('user.statusId', StatusConst::ACTIVE)
            ->when(isset($request['dateStart']), function (Builder $query) use ($request) {
                $query->where('balanceFlow.date', '>=', Carbon::parse($request['dateStart'])->startOfDay());
            })
            ->when(isset($request['dateEnd']), function (Builder $query) use ($request) {
                $query->where('balanceFlow.date', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
            })
            ->when(isset($request['userId']), function (Builder $query) use ($request) {
                $query->where('user.idUser', $request['userId']);
            })
            ->when(!$isSupport && isset($cityId), function (Builder $query) use ($cityId) {
                $query->where('city.id', $cityId);
            })
            ->get();
    }

    public function findFavoriteDriver(array $request, User $authUser = null)
    {
        return FavoriteDriverRO::query()
            ->join('customer', 'favoriteDriver.customerId', '=', 'customer.idCustomer')
            ->join('driver', 'favoriteDriver.driverId', '=', 'driver.idDriver')
            ->join('user as u', 'u.idUser', '=', 'customer.userId')
            ->join('user as um', 'um.idUser', '=', 'driver.userId')
            ->where('favoriteDriver.status', '=', 1)
            ->select(
            'u.name as customerName',
            'um.name as driverName',
            'favoriteDriver.created_at as favoriteDateByCustomer'
            )
            ->selectSub("
                (SELECT
                    COUNT(trip.idTrip)
                FROM trip
                    WHERE trip.userId = customer.userId
                      AND trip.driverId = favoriteDriver.driverId
                      AND trip.status = 'finished'
                      AND trip.favoriteDrivers IS NOT NULL)
            ", "tripQuantity")
            ->when(isset($request['userId']), function (Builder $query) use ($request) {
                $query->where('customer.userId', $request['userId']);
            })
            ->when(isset($request['driverId']), function (Builder $query) use ($request) {
                $query->where('driver.idDriver', $request['driverId']);
            })
            ->when(isset($request['startDate']), function (Builder $query) use ($request) {
                $query->where('favoriteDriver.created_at', '>=', Carbon::parse($request['startDate'])->startOfDay());
            })
            ->when(isset($request['endDate']), function (Builder $query) use ($request) {
                $query->where('favoriteDriver.created_at', '<=', Carbon::parse($request['endDate'])->endOfDay());
            })
            ->when(isset($request['cityId']), function (Builder $query) use ($request) {
                $query->where('driver.cityId', $request['cityId']);
            })
            ->when(isset($authUser->role->support) && !$authUser->role->support, function (Builder $query) use ($authUser) {
                $query->whereIn('driver.cityId', function (\Illuminate\Database\Query\Builder $query) use ($authUser) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleCity.roleId', $authUser->roleId);
                });
            })
            ->get();
    }

    public function findByRegister(array $request = [])
    {
        return $this->getModel()
            ::join('user', 'customer.userId', '=', 'idUser')
            ->join('customerRegisterStatus', 'customer.customerRegisterStatusId', '=', 'customerRegisterStatus.idCustomerRegisterStatus')
            ->join('balance', 'customer.balanceId', '=', 'balance.idBalance')
            ->leftJoin('city', 'user.cityId', 'city.id')
            ->where('user.statusId', StatusConst::ACTIVE)
            ->select(
                'user.name',
                'user.document',
                'user.phone',
                'user.email',
                'user.dateOfBirth',
                'user.created_at',
                'balance.tripBalance AS voucher',
                'customer.userId',
                'customerRegisterStatus.name AS statusCustomer',
                'city.nome as cityName'
            )
            ->selectSub("
                SELECT
                    COUNT(*)
                FROM trip
                    WHERE trip.userId = user.idUser AND trip.status = 'finished'
            ", 'tripsFinished')
            ->orderByDesc('user.created_at')
            ->where('user.registered_in', $request['registered_in'])
            ->when(isset($request['name']), function (Builder $query) use ($request) {
                $query->where('user.name', 'LIKE', "%" . $request['name'] . "%");
            })
            ->when(isset($request['dateStart']), function (Builder $query) use ($request) {
                $query->where(
                    'user.created_at', '>=', Carbon::parse($request['dateStart'])->startOfDay());
            })
            ->when(isset($request['dateEnd']), function (Builder $query) use ($request) {
                $query->where(
                    'user.created_at', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
            })
            ->when(isset($request['tripBalance']), function (Builder $query) use ($request) {
                $query->where('balance.tripBalance', $request['tripBalance']);
            })
            ->when(isset($request['customerRegisterStatusId']), function (Builder $query) use ($request) {
                $query->where('idCustomerRegisterStatus', '=', $request['customerRegisterStatusId']);
            })
            ->when(isset($request['cityId']), function (Builder $query) use ($request) {
                $query->where('user.cityId', '=', $request['cityId']);
            })
            ->get();
    }

    public function driverBlockedByCustomer(array $request = [], User $authUser = null)
    {
        return RefusedDriver::query()
            ->join('customer', 'refusedDriver.customerId', '=', 'customer.idCustomer')
            ->join('driver', 'refusedDriver.driverId', '=', 'driver.idDriver')
            ->join('user as u', 'u.idUser', '=', 'customer.userId')
            ->join('user as um', 'um.idUser', '=', 'driver.userId')
            ->where('refusedDriver.statusId', '=', StatusConst::ACTIVE)
            ->select(
                'u.name as customerName',
                'um.name as driverName',
                'refusedDriver.created_at as blockedDateByCustomer'
            )
            ->when(isset($request['userId']), function (Builder $query) use ($request) {
                $query->where('customer.userId', $request['userId']);
            })
            ->when(isset($request['driverId']), function (Builder $query) use ($request) {
                $query->where('driver.idDriver', $request['driverId']);
            })
            ->when(isset($request['startDate']), function (Builder $query) use ($request) {
                $query->where('refusedDriver.created_at', '>=', Carbon::parse($request['startDate'])->startOfDay());
            })
            ->when(isset($request['endDate']), function (Builder $query) use ($request) {
                $query->where('refusedDriver.created_at', '<=', Carbon::parse($request['endDate'])->endOfDay());
            })
            ->when(isset($request['cityId']), function (Builder $query) use ($request) {
                $query->where('driver.cityId', $request['cityId']);
            })
            ->when(isset($authUser->role->support) && !$authUser->role->support, function (Builder $query) use ($authUser) {
                $query->whereIn('driver.cityId', function (\Illuminate\Database\Query\Builder $query) use ($authUser) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleCity.roleId', $authUser->roleId);
                });
            })
            ->get();
    }
}
