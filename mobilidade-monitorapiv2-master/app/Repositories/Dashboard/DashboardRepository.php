<?php

namespace App\Repositories\Dashboard;

use App\Constants\PaginationConst;
use App\Constants\StatusConst;
use App\Constants\Trip\TripConst;
use App\Constants\Users\UserTypeConst;
use App\Models\Config\Config;
use App\Models\ReadOnly\Customer\CustomerRO;
use App\Models\ReadOnly\Trip\DriverCalledRO;
use App\Models\ReadOnly\Trip\DriverRO;
use App\Models\ReadOnly\Trip\TripRO;
use App\Models\Role\Role;
use App\Models\Trip\Trip;
use App\Models\User\Driver;
use App\Utils\RedisDriverCalled;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\DB;

class DashboardRepository
{
    private const TRIPS_BY_STATUS_LIMIT = 100;

    public function quantityTripsByStatus(array $request)
    {
        return DB::select("
            (SELECT 'Aceitas' AS status,
            coalesce(
                   (SELECT count(idTrip)
                    FROM trip
                    WHERE status = 'accepted'), 0) AS quantity)
            UNION
            (SELECT 'Finalizadas' AS status,
                    coalesce(
                   (SELECT count(idTrip)
                    FROM trip
                    WHERE status = 'finished'), 0) AS quantity);
        ");
    }

    public function quantityTripsCanceledByUser(array $request)
    {
        return DB::select("
            (SELECT 'Motorista' AS canceledBy,
            coalesce(
                (SELECT count(idTrip)
                    FROM trip
                    WHERE status = 'canceled'
                    and canceledBy  = 'driver'), 0) AS quantity)
            UNION
            (SELECT 'Cliente' AS status,
                    coalesce(
                (SELECT count(idTrip)
                    FROM trip
                    WHERE status = 'canceled'
                    and canceledBy  = 'customer'), 0) AS quantity);
        ");
    }

    public function totalBillingByPaymentForm(array $request)
    {
        return Trip::select(
            'tripPaymentForm.name as paymentForm ',
            DB::raw('round(sum(price), 2) as totalValue')
        )
            ->join('tripPaymentForm', 'trip.tripPaymentFormId', 'tripPaymentForm.idTripPaymentForm')
            ->where('trip.status', 'finished')
            ->groupBy('tripPaymentFormId')
            ->when(isset($request['dateStart']), function (Builder $query) use ($request) {
                $query->where('trip.date', '>=', Carbon::parse($request['dateStart'])->startOfDay());
            })
            ->when(isset($request['dateEnd']), function (Builder $query) use ($request) {
                $query->where('trip.date', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
            })
            ->get();
    }

    public function averageTicketValue(array $request)
    {
        return Trip::select(
            DB::raw('round(sum(price), 2) as totalValue'),
            DB::raw('count(idTrip) as quantity'),
            DB::raw('round(round(sum(price), 2)/count(idTrip), 2) as averageTicket')
        )
            ->where('trip.status', 'finished')
            ->when(isset($request['dateStart']), function (Builder $query) use ($request) {
                $query->where('trip.date', '>=', Carbon::parse($request['dateStart'])->startOfDay());
            })
            ->when(isset($request['dateEnd']), function (Builder $query) use ($request) {
                $query->where('trip.date', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
            })
            ->get();
    }

    public function rankingDriver(array $request, int $cityId)
    {
        $limit = $request['limit'] ?? 10;
        $offset = isset($request['page']) ? ($request['page'] - 1) * $limit : 0;
        
        return Trip::select(
            'idDriver',
            'name',
            'user.phone',
            DB::raw('count(idTrip) as quantityTrips'),
            DB::raw('round(sum(price), 2) as totalValue')
        )
            ->join('driver', 'trip.driverId', 'driver.idDriver')
            ->join('user', 'driver.userId', 'user.idUser')
            ->where('trip.status', 'finished')
            ->where('trip.cityId', $cityId)
            ->groupBy('driverId')
            ->orderByDesc('quantityTrips')
            ->when(isset($request['dateStart']), function (Builder $query) use ($request) {
                $query->where('trip.date', '>=', Carbon::parse($request['dateStart'])->startOfDay());
            })
            ->when(isset($request['dateEnd']), function (Builder $query) use ($request) {
                $query->where('trip.date', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
            })
            ->offset($offset)
            ->limit($limit)
            ->get();
    }

    public function rankingDriverAll(array $request)
    {
        return Trip::select(
            'idDriver',
            'name',
            'user.phone',
            DB::raw('count(idTrip) as quantityTrips'),
            DB::raw('round(sum(price), 2) as totalValue')
        )
            ->join('driver', 'trip.driverId', 'driver.idDriver')
            ->join('user', 'driver.userId', 'user.idUser')
            ->where('trip.status', 'finished')
            ->groupBy('driverId')
            ->orderByDesc('quantityTrips')
            ->limit($request['limit'] ?? 5)
            ->when(isset($request['dateStart']), function (Builder $query) use ($request) {
                $query->where('trip.date', '>=', Carbon::parse($request['dateStart'])->startOfDay());
            })
            ->when(isset($request['dateEnd']), function (Builder $query) use ($request) {
                $query->where('trip.date', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
            })
            ->get();
    }

    public function rankingCustomer(array $request, int $cityId)
    {
        $limit = $request['limit'] ?? 10;
        $offset = isset($request['page']) ? ($request['page'] - 1) * $limit : 0;
        
        return Trip::select(
            'idUser',
            'name',
            'user.phone',
            DB::raw('count(idTrip) as quantityTrips'),
            DB::raw('round(sum(price), 2) as totalValue')
        )
            ->join('user', 'trip.userId', 'user.idUser')
            ->where('trip.status', 'finished')
            ->where('trip.cityId', $cityId)
            ->groupBy('userId')
            ->orderByDesc('quantityTrips')
            ->when(isset($request['dateStart']), function (Builder $query) use ($request) {
                $query->where('trip.date', '>=', Carbon::parse($request['dateStart'])->startOfDay());
            })
            ->when(isset($request['dateEnd']), function (Builder $query) use ($request) {
                $query->where('trip.date', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
            })
            ->offset($offset)
            ->limit($limit)
            ->get();
    }

    public function rankingCustomerAll(array $request)
    {
        return Trip::select(
            'idUser',
            'name',
            'user.phone',
            DB::raw('count(idTrip) as quantityTrips'),
            DB::raw('round(sum(price), 2) as totalValue')
        )
            ->join('user', 'trip.userId', 'user.idUser')
            ->where('trip.status', 'finished')
            ->groupBy('userId')
            ->orderByDesc('quantityTrips')
            ->limit($request['limit'] ?? 5)
            ->when(isset($request['dateStart']), function (Builder $query) use ($request) {
                $query->where('trip.date', '>=', Carbon::parse($request['dateStart'])->startOfDay());
            })
            ->when(isset($request['dateEnd']), function (Builder $query) use ($request) {
                $query->where('trip.date', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
            })
            ->get();
    }

    public function quantityDriversTotal(array $request = [])
    {
        return Driver::select(
            DB::raw('count(idDriver) as quantityDriversTotal')
        )
            ->join('user', 'driver.userId', 'user.idUser')
            ->where('user.statusId', 1)
            ->get();
    }

    public function quantityDriversActive(array $request = [])
    {
        return Driver::select(
            DB::raw('count(distinct(idDriver)) as quantityDriversActive')
        )
            ->join('user', 'driver.userId', 'user.idUser')
            ->join('trip', 'driver.idDriver', 'trip.driverId')
            ->where('user.statusId', 1)
            ->where('trip.status', 'finished')
            ->where('trip.date', '>=', Carbon::now()->startOfMonth())
            ->get();
    }

    public function quantityCustomersTotal(array $request = [])
    {
        return CustomerRO::select(
            DB::raw('count(idCustomer) as quantityCustomersTotal')
        )
            ->join('user', 'customer.userId', 'user.idUser')
            ->where('user.statusId', 1)
            ->get();
    }

    public function quantityCustomersActive(array $request = [])
    {
        return CustomerRO::select(
            DB::raw('count(idCustomer) as quantityCustomersTotal')
        )
            ->join('user', 'customer.userId', 'user.idUser')
            ->join('trip', 'user.idUser', 'trip.userId')
            ->where('user.statusId', 1)
            ->where('trip.status', 'finished')
            ->where('trip.date', '>=', Carbon::now()->startOfMonth())
            ->get();
    }

    public function rankingCallType(array $request)
    {
        return Trip::query()->select(
            'name as callType',
            DB::raw('count(idTrip) as quantityTrips')
        )
            ->join('tripCallType', 'trip.tripCallTypeId', 'tripCallType.id')
            ->groupBy('tripCallTypeId')
            ->orderByDesc('quantityTrips')
            ->when(isset($request['dateStart']), function (Builder $query) use ($request) {
                $query->where('trip.date', '>=', Carbon::parse($request['dateStart'])->startOfDay());
            })
            ->when(isset($request['dateEnd']), function (Builder $query) use ($request) {
                $query->where('trip.date', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
            })
            ->get();
    }

    public function rankingNeighborhood(array $request)
    {
        return Trip::select(
            'neighborhood',
            DB::raw('count(idTrip) as quantityTrips')
        )
            ->join('origin', 'trip.originId', 'origin.idOrigin')
            ->groupBy('neighborhood')
            ->orderByDesc('quantityTrips')
            ->limit($request['limit'] ?? 5)
            ->when(isset($request['dateStart']), function (Builder $query) use ($request) {
                $query->where('trip.date', '>=', Carbon::parse($request['dateStart'])->startOfDay());
            })
            ->when(isset($request['dateEnd']), function (Builder $query) use ($request) {
                $query->where('trip.date', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
            })
            ->get();
    }

    public function rankingHorary(array $request)
    {
        return TripRO::select(
            DB::raw('date_format(date, \'%H\') as hour'),
            DB::raw('count(idTrip) as quantityTrips')
        )
            ->groupBy(DB::raw('date_format(date, \'%H\')'))
            ->orderByDesc('quantityTrips')
            ->limit($request['limit'] ?? 5)
            ->when(isset($request['dateStart']), function (Builder $query) use ($request) {
                $query->where('trip.date', '>=', Carbon::parse($request['dateStart'])->startOfDay());
            })
            ->when(isset($request['dateEnd']), function (Builder $query) use ($request) {
                $query->where('trip.date', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
            })
            ->get();
    }

    public function lastDynamicsPlaces(array $request, ?int $cityId)
    {
        return Trip::select(
            'price',
            'multiplierDynamic',
            'date',
            'origin.latitude',
            'origin.longitude',
            'origin.neighborhood'
        )
            ->join('origin', 'trip.originId', 'origin.idOrigin')
            ->where('multiplierDynamic', '>', 0)
            ->where('date', '>=', Carbon::now()->startOfDay())
            ->orderByDesc('date')
            ->when(isset($cityId), function (Builder $query) use ($cityId) {
                $query->where('trip.cityId', $cityId);
            })
            ->when(isset($request['limit']), function (Builder $query) use ($request) {
                $query->limit($request['limit']);
            })
            ->get();
    }

    public function expensiveDynamicsPlaces(array $request, ?int $cityId)
    {
        return TripRO::select(
            'price',
            'multiplierDynamic',
            'date',
            'origin.latitude',
            'origin.longitude',
            'origin.neighborhood'
        )
            ->join('origin', 'trip.originId', 'origin.idOrigin')
            ->where('multiplierDynamic', '>', 0)
            ->where('date', '>=', Carbon::now()->startOfDay())
            ->orderByDesc('multiplierDynamic')
            ->when(isset($cityId), function (Builder $query) use ($cityId) {
                $query->where('trip.cityId', $cityId);
            })
            ->when(isset($request['limit']), function (Builder $query) use ($request) {
                $query->limit($request['limit']);
            })
            ->get();
    }

    public function placesMoreTripsDayAgo(array $request, ?int $cityId)
    {
        return TripRO::select(
            'date',
            'origin.latitude',
            'origin.longitude',
            'origin.neighborhood'
        )
            ->join('origin', 'trip.originId', 'origin.idOrigin')
            ->whereBetween('date', [Carbon::now()->subDay()->startOfDay(), Carbon::now()->subDay()->endOfDay()])
            ->whereNotNull('origin.neighborhood')
            ->when(isset($cityId), function (Builder $query) use ($cityId) {
                $query->where('trip.cityId', $cityId);
            })
            ->when(isset($request['timeStart']), function (Builder $query) use ($request) {
                $query->where(DB::raw("date_format(date, '%H:%i:%s')"), '>=', $request['timeStart']);
            })
            ->when(isset($request['timeEnd']), function (Builder $query) use ($request) {
                $query->where(DB::raw("date_format(date, '%H:%i:%s')"), '<=', $request['timeEnd']);
            })
            ->get();
    }

    public function placesMoreTripsWeekAgo(array $request, ?int $cityId)
    {
        return TripRO::query()->select(
            'date',
            'origin.latitude',
            'origin.longitude',
            'origin.neighborhood'
        )
            ->join('origin', 'trip.originId', 'origin.idOrigin')
            ->whereBetween('date', [Carbon::now()->subWeek()->startOfDay(), Carbon::now()->subWeek()->endOfDay()])
            ->whereNotNull('origin.neighborhood')
            ->when(isset($cityId), function (Builder $query) use ($cityId) {
                $query->where('trip.cityId', $cityId);
            })
            ->when(isset($request['timeStart']), function (Builder $query) use ($request) {
                $query->where(DB::raw("date_format(date, '%H:%i:%s')"), '>=', $request['timeStart']);
            })
            ->when(isset($request['timeEnd']), function (Builder $query) use ($request) {
                $query->where(DB::raw("date_format(date, '%H:%i:%s')"), '<=', $request['timeEnd']);
            })
            ->get();
    }

    public function tripQuantities(int $idUser, ?string $date, int $cityId = null)
    {
        DB::setDefaultConnection('mysql_ro');

        $travelingUsers = array_column((TripRO::query()->select(DB::raw('distinct(userId)'))
            ->where(DB::raw("DATE_FORMAT(date, '%Y-%m-%d')"), Carbon::parse(new \DateTime($date ?? 'now'))->format('Y-m-d'))
            ->where('status', 'finished')
            ->when(isset($cityId), function (Builder $query) use ($cityId) {
                $query->where('cityId', $cityId);
            })
            ->get())->toArray(), 'userId');

        return TripRO::select(
            DB::raw("date_format(trip.date, '%Y-%m-%d') as date"),
            'trip.cityId',
            DB::raw('count(trip.idTrip) as totalTodayTrips'),
            DB::raw("sum(if(not (`status` in ('not_answered', 'back_off', 'searching', 'searching_favorite', 'pre_accepted') or
                   (`status` = 'canceled' and `driverId` is null)), 1, 0)) as totalAcceptedTrips"),
            DB::raw('format(sum(trip.price), 2) as totalPrice'),
            DB::raw("sum(if(status = 'finished', 1, 0)) as quantityTripsFinished"),
            DB::raw("format(sum(if(status = 'finished', price, 0)), 2) as totalPriceFinished"),
            DB::raw("sum(if(`status` = 'not_answered' or `status` = 'back_off' or
              (`status` = 'canceled' and `driverId` is null), 1, 0)) as quantityTripsNotAnswered"),
            DB::raw("format(sum(if(`status` = 'not_answered' or `status` = 'back_off' or
                     (`status` = 'canceled' and `driverId` is null), price, 0)), 2) as totalPriceNotAnswered"),
            DB::raw('ifnull(customers_not_answered.quantityCustomersNotAnswered, 0) as quantityCustomersNotAnswered'),
            DB::raw('ifnull(lost_customers_not_answered.lost_customers_not_answered, 0) as lostCustomersNotAnswered'),
            DB::raw("sum(if(`status` = 'back_off' and `driverId` is null, 1, 0)) as quantityTripsBackOff"),
            DB::raw("format(sum(if(`status` = 'back_off' and `driverId` is null, price, 0)), 2) as totalPriceBackOff"),
            DB::raw("sum(if(`status` = 'not_answered' and `driverId` is null, 1, 0)) as quantityTripsNotAttended"),
            DB::raw("format(sum(if(`status` = 'not_answered' and `driverId` is null, price, 0)), 2) as totalPriceNotAttended"),
            DB::raw("sum(if(`status` = 'canceled' and `driverId` is not null, 1, 0)) as quantityTripsCanceled"),
            DB::raw("format(sum(if(`status` = 'canceled' and `driverId` is not null, trip.price, 0)), 2) as totalPriceCanceled"),
            DB::raw("sum(if(`status` = 'canceled' and `canceledBy` = 'customer', 1, 0)) as totalCanceledByCustomer"),
            DB::raw("sum(if(`status` = 'canceled' and `canceledBy` = 'driver', 1, 0)) as totalCanceledByDriver"),
            DB::raw("sum(if(`status` = 'canceled' and `canceledBy` = 'admin', 1, 0)) as totalCanceledByAdmin"),
            DB::raw("sum(if(`tripPaymentForm`.`paymentFormTypeId` = 1, 1, 0)) as totalVoucherTrips"),
            DB::raw("sum(if(`tripPaymentForm`.`paymentFormTypeId` = 2, 1, 0)) as totalMoneyTrips"),
            DB::raw("sum(if(`tripPaymentForm`.`paymentFormTypeId` in (3, 4, 8), 1, 0)) as totalCardTrips")
        )
            ->join('user as uadm', 'uadm.idUser', DB::raw($idUser))
            ->leftJoin('tripPaymentForm', 'trip.tripPaymentFormId', 'tripPaymentForm.idTripPaymentForm')
            ->leftJoinSub(
                DB::table('trip')
                    ->select(
                        DB::raw('COUNT(DISTINCT trip.userId) AS quantityCustomersNotAnswered'),
                        DB::raw("DATE_FORMAT(trip.date, '%Y-%m-%d') AS date"),
                        'trip.cityId'
                    )
                    ->where('status', TripConst::NOT_ANSWERED)
                    ->orWhere('status', TripConst::BACK_OFF)
                    ->orWhere(function (\Illuminate\Database\Query\Builder $query) {
                        $query->where('status', TripConst::CANCELED)
                            ->whereNull('driverId');
                    })
                    ->groupBy('cityId', DB::raw("DATE_FORMAT(trip.date, '%Y-%m-%d')")),
                'customers_not_answered',
                function (JoinClause $join) {
                    $join->on('customers_not_answered.cityId', 'trip.cityId')
                        ->where('customers_not_answered.date', DB::raw("DATE_FORMAT(trip.date, '%Y-%m-%d')"));
                }
            )
            ->leftJoinSub(
                DB::table('trip')
                    ->select(
                        DB::raw('COUNT(DISTINCT trip.userId) AS lost_customers_not_answered'),
                        DB::raw("DATE_FORMAT(trip.date, '%Y-%m-%d') AS date"),
                        'trip.cityId'
                    )
                    ->where(function (\Illuminate\Database\Query\Builder $query) {
                        $query->where('status', TripConst::NOT_ANSWERED)
                            ->orWhere('status', TripConst::BACK_OFF)
                            ->orWhere(function (\Illuminate\Database\Query\Builder $query) {
                                $query->where('status', TripConst::CANCELED)
                                    ->whereNull('driverId');
                            });
                    })
                    ->where(function (\Illuminate\Database\Query\Builder $query) use ($travelingUsers) {
                        $query->whereNotIn('trip.userId', $travelingUsers);
                    })
                    ->groupBy('cityId', DB::raw("DATE_FORMAT(trip.date, '%Y-%m-%d')")),
                'lost_customers_not_answered',
                function (JoinClause $join) {
                    $join->on('lost_customers_not_answered.cityId', 'trip.cityId')
                        ->where('lost_customers_not_answered.date', DB::raw("DATE_FORMAT(trip.date, '%Y-%m-%d')"));
                }
            )
            ->whereIn('trip.cityId', function (\Illuminate\Database\Query\Builder $query) {
                $query->select('roleCity.cityId')
                    ->from('roleCity')
                    ->where('roleCity.roleId', DB::raw('uadm.roleId'));
            })
            ->where(DB::raw("DATE_FORMAT(trip.date, '%Y-%m-%d')"), Carbon::parse(new \DateTime($date ?? 'now'))->format('Y-m-d'))
            ->when(isset($cityId), function (Builder $query) use ($cityId) {
                $query->where('trip.cityId', $cityId);
            })
            ->groupBy('trip.cityId', DB::raw("DATE_FORMAT(trip.date, '%Y-%m-%d')"))
            ->orderByDesc('trip.date')
            ->when(!isset($date), function (Builder $query) {
                $query->limit(1);
            })
            ->get();
    }

    public function activeTrips(int $cityId = null, array $filters = []): array
    {
        $page = $filters['page'] ?? 1;
        $perPage = $filters['perPage'] ?? PaginationConst::LIMIT_PER_PAGE;

        $trips = $this->baseActiveTripQuery($cityId, $filters)
            ->orderByRaw('tripScheduled.schedule IS NULL')
            ->orderBy('tripScheduled.schedule', 'ASC')
            ->orderByDesc('trip.date')
            ->paginate($perPage, ['*'], 'page', $page);

        $data = $this->attachDriversCalled($trips->getCollection());

        return [
            'data' => $data,
            'current_page' => $trips->currentPage(),
            'last_page' => $trips->lastPage(),
            'per_page' => $trips->perPage(),
            'total' => $trips->total(),
            'next_page_url' => $trips->nextPageUrl(),
            'prev_page_url' => $trips->previousPageUrl(),
            'scheduledTotal' => $this->countScheduledActiveTrips($cityId, $filters),
        ];
    }

    public function findActiveTripDetail(string $tripReference): ?array
    {
        $trip = $this->baseActiveTripQuery(null, ['tripReference' => $tripReference])->first();

        if (!$trip) {
            return null;
        }

        $data = $this->attachDriversCalled(collect([$trip]));

        return $data[0] ?? null;
    }

    private function baseActiveTripQuery(?int $cityId, array $filters = [])
    {
        $customerName = $filters['customerName'] ?? null;
        $driverName = $filters['driverName'] ?? null;
        $status = $filters['status'] ?? null;
        $excludeScheduled = filter_var($filters['excludeScheduled'] ?? false, FILTER_VALIDATE_BOOLEAN);
        $tripReference = $filters['tripReference'] ?? null;

        return TripRO::query()->join('tripAudit', 'trip.tripAuditId', 'tripAudit.id')
            ->join('tripPaymentForm', 'trip.tripPaymentFormId', 'tripPaymentForm.idTripPaymentForm')
            ->join('tripType', 'trip.tripTypeId', 'tripType.idTripType')
            ->join('user as customerUser', 'trip.userId', 'customerUser.idUser')
            ->join('origin', 'trip.originId', 'origin.idOrigin')
            ->join('destination', 'trip.destinationId', 'destination.idDestination')
            ->leftJoin('customer', 'trip.userId', 'customer.userId')
            ->leftJoin('driver', 'trip.driverId', 'driver.idDriver')
            ->leftJoin('user as driverUser', 'driver.userId', 'driverUser.idUser')
            ->leftJoin('tripCustomer', 'trip.tripCustomerId', 'tripCustomer.id')
            ->leftJoin('customer as customerTrip', 'trip.customerId', 'customerTrip.idCustomer')
            ->leftJoin('centralCustomer', 'trip.centralCustomerId', 'centralCustomer.id')
            ->leftJoin('user as centralCustomerUser', 'centralCustomer.userId', 'centralCustomerUser.idUser')
            ->leftJoin('customer as centralCustomerProfile', 'centralCustomerUser.idUser', 'centralCustomerProfile.userId')
            ->leftJoin('levelAccess as driverLevelAccess', 'driverUser.idUser', 'driverLevelAccess.userId')
            ->leftJoin('userType as driverUserType', 'driverLevelAccess.userTypeId', 'driverUserType.idUserType')
            ->leftJoin('tripScheduled', 'trip.tripReference', 'tripScheduled.tripReference')
            ->whereNotIn('trip.status', TripConst::OFF_STATUSES)
            ->when(isset($cityId), function (Builder $query) use ($cityId) {
                $query->where('trip.cityId', $cityId);
            })
            ->when($customerName, function (Builder $query, $customerName) {
                $query->where(function (Builder $q) use ($customerName) {
                    $q->where('centralCustomer.name', 'LIKE', "%{$customerName}%")
                        ->orWhere('tripCustomer.name', 'LIKE', "%{$customerName}%")
                        ->orWhere('customerTrip.name', 'LIKE', "%{$customerName}%")
                        ->orWhere('customerUser.name', 'LIKE', "%{$customerName}%");
                });
            })
            ->when($driverName, function (Builder $query, $driverName) {
                $query->where('driverUser.name', 'LIKE', "%{$driverName}%");
            })
            ->when($status, function (Builder $query, $status) {
                $query->where('trip.status', $status);
            })
            ->when($excludeScheduled, function (Builder $query) {
                $query->where('trip.status', '!=', TripConst::SCHEDULED);
            })
            ->when($tripReference, function (Builder $query, $tripReference) {
                $query->where('trip.tripReference', $tripReference);
            })
            ->with([
                'tripWayPoints' => function ($query) {
                    $query->select(
                        'id',
                        'tripReference',
                        'latitude',
                        'longitude',
                        'address',
                        'neighborhood',
                        'created_at'
                    )->orderBy('created_at', 'asc');
                }
            ])
            ->select(
                'trip.idTrip',
                'trip.tripReference',
                'trip.date',
                'trip.price',
                'trip.driverId',
                'driver.userId AS driverUserId',
                'driver.appVersion AS driverAppVersion',
                'driverUser.name AS driverName',
                'driver.profileImage AS driverPhoto',
                'trip.userId',
                'customer.appVersion AS customerAppVersion',
                'trip.customerId',
                'trip.zoneId',
                'trip.tripTypeId',
                DB::raw('
                CASE
                   WHEN trip.centralCustomerId IS NOT NULL THEN centralCustomer.name
                   WHEN trip.tripCustomerId IS NOT NULL THEN tripCustomer.name
                   WHEN trip.customerId IS NOT NULL THEN customerTrip.name
                   ELSE customerUser.name
                END AS customerName'),
                DB::raw('
                CASE
                   WHEN trip.centralCustomerId IS NOT NULL THEN centralCustomerProfile.profileImage
                   WHEN trip.customerId IS NOT NULL THEN customerTrip.profileImage
                   ELSE customer.profileImage
                END AS customerPhoto'),
                'trip.status',
                'trip.canceledBy',
                'trip.callingDriver',
                'tripPaymentForm.name AS paymentForm',
                'tripType.type AS tripType',
                'trip.favoriteDrivers',
                'tripAudit.situation',
                'origin.latitude AS originLatitude',
                'origin.longitude AS originLongitude',
                'origin.address AS originAddress',
                'destination.latitude AS destinationLatitude',
                'destination.longitude AS destinationLongitude',
                'destination.address AS destinationAddress',
                'driverLevelAccess.userTypeId AS driverTypeId',
                'driverUserType.name AS driverType',
                'driver.last_lat',
                'driver.last_lon',
                'tripScheduled.schedule'
            );
    }

    private function attachDriversCalled($tripsCollection): array
    {
        $tripsArray = $tripsCollection->toArray();

        $tripReferencesToGetDriversCalled = array_filter($tripsArray, function ($trip) {
            return in_array($trip['status'], TripConst::SEARCHING_STATUSES);
        });

        $tripReferencesToGetDriversCalled = array_map(function ($trip) {
            return $trip['tripReference'];
        }, $tripReferencesToGetDriversCalled);

        $redisEnabled = (bool) Config::getConf('enable_redis_into_driver_called');

        if ($redisEnabled) {
            $redisClient = new RedisDriverCalled();

            $driversCalleds = [];

            array_map(function ($tripReference) use ($redisClient, &$driversCalleds) {
                $data = $redisClient->get("trip-{$tripReference}-call-drivers");

                foreach ($data as $driver) {
                    $driversCalleds[] = (array) $driver;
                }
            }, $tripReferencesToGetDriversCalled);
        } else {
            $driversCalleds = DriverCalledRO::query()
                ->whereIn('driverCalled.tripReference', $tripReferencesToGetDriversCalled)
                ->join('driver', 'driverCalled.driverId', 'driver.idDriver')
                ->join('user', 'driver.userId', 'user.idUser')
                ->join('levelAccess', 'user.idUser', 'levelAccess.userId')
                ->join('userType', 'levelAccess.userTypeId', 'userType.idUserType')
                ->leftJoin('tripHistory', function (JoinClause $query) {
                    $query
                        ->where('driverCalled.driverId', 'tripHistory.driverId')
                        ->on('tripHistory.tripReference', 'driverCalled.tripReference');
                })
                ->orderBy('driverCalled.id')
                ->select(
                    'user.name',
                    'user.nickname',
                    DB::raw('IF(ISNULL(tripHistory.idTripHistory), 0, 1) AS touched'),
                    DB::raw('
                        CASE
                            WHEN ISNULL(tripHistory.status) = 1
                            THEN
                                driverCalled.status
                            ELSE
                            IF(tripHistory.status = \'calling\', driverCalled.status, tripHistory.status)
                        END AS status
                    '),
                    'user.phone',
                    'user.rating',
                    'driver.profileImage',
                    'driver.last_lat',
                    'driver.last_lon',
                    'levelAccess.userTypeId',
                    'userType.name AS type',
                    'driverCalled.id',
                    'driverCalled.driverId',
                    'driverCalled.tripReference',
                    'driverCalled.proximity',
                    'driverCalled.created_at',
                    'driverCalled.updated_at'
                )
                ->get();
        }

        $driversCalleds = collect($driversCalleds)->sortBy('id')->values()->toArray();

        return array_map(function ($trip) use ($driversCalleds) {
            $trip['driversCalled'] = [];

            foreach ($driversCalleds as $driverCalled) {
                if ($driverCalled['tripReference'] === $trip['tripReference']) {
                    $trip['driversCalled'][] = $driverCalled;
                }
            }

            // Converter trip_way_points (snake_case) para tripWayPoints (camelCase)
            $trip['tripWayPoints'] = $trip['trip_way_points'] ?? [];
            unset($trip['trip_way_points']);

            return $trip;
        }, $tripsArray);
    }

    public function countScheduledActiveTrips(int $cityId = null, array $filters = []): int
    {
        $customerName = $filters['customerName'] ?? null;
        $driverName = $filters['driverName'] ?? null;

        return TripRO::query()
            ->where('trip.status', TripConst::SCHEDULED)
            ->when(isset($cityId), function (Builder $query) use ($cityId) {
                $query->where('trip.cityId', $cityId);
            })
            ->when($customerName, function (Builder $query, $customerName) {
                $query
                    ->leftJoin('centralCustomer', 'trip.centralCustomerId', 'centralCustomer.id')
                    ->leftJoin('tripCustomer', 'trip.tripCustomerId', 'tripCustomer.id')
                    ->leftJoin('customer as customerTrip', 'trip.customerId', 'customerTrip.idCustomer')
                    ->join('user as customerUser', 'trip.userId', 'customerUser.idUser')
                    ->where(function (Builder $q) use ($customerName) {
                        $q->where('centralCustomer.name', 'LIKE', "%{$customerName}%")
                            ->orWhere('tripCustomer.name', 'LIKE', "%{$customerName}%")
                            ->orWhere('customerTrip.name', 'LIKE', "%{$customerName}%")
                            ->orWhere('customerUser.name', 'LIKE', "%{$customerName}%");
                    });
            })
            ->when($driverName, function (Builder $query, $driverName) {
                $query
                    ->leftJoin('driver', 'trip.driverId', 'driver.idDriver')
                    ->leftJoin('user as driverUser', 'driver.userId', 'driverUser.idUser')
                    ->where('driverUser.name', 'LIKE', "%{$driverName}%");
            })
            ->count();
    }

    public function getCountDrivers(Role $authRole = null, ?int $cityId = null): Collection
    {
        return DriverRO::select(
            'userType.name as type',
            'userType.picture',
            DB::raw("count(driver.idDriver) as total"),
            DB::raw("count(if(driver.driverRegisterStatusId = 1, 1, null)) as active"),
            DB::raw("count(if(driver.driverRegisterStatusId = 2, 1, null)) as pending"),
            DB::raw("count(if(driver.driverRegisterStatusId = 3, 1, null)) as blocked"),
            DB::raw("count(if(driver.driverRegisterStatusId = 4, 1, null)) as waiting_answer"),
            DB::raw("count(if(driver.driverRegisterStatusId = 5, 1, null)) as blacklist")
        )
            ->join('levelAccess', 'driver.userId', 'levelAccess.userId')
            ->join('userType', 'levelAccess.userTypeId', 'userType.idUserType')
            ->join('user', 'driver.userId', 'user.idUser')
            ->where('userType.isDriver', true)
            ->where('userType.isActive', true)
            ->where('user.statusId', StatusConst::ACTIVE)
            ->when(isset($cityId), function (Builder $query) use ($cityId) {
                $query->where('driver.cityId', $cityId);
            })
            ->when(isset($authRole->support) && !$authRole->support, function (Builder $query) use ($authRole) {
                $query->whereIn('driver.cityId', function (\Illuminate\Database\Query\Builder $query) use ($authRole) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleCity.roleId', $authRole->id);
                });
            })
            ->groupBy('userType.idUserType')
            ->get();
    }

    public function getCountCustomers(Role $authRole = null, ?int $cityId = null): Collection
    {
        return CustomerRO::query()->select(
            'userType.name as type',
            DB::raw("count(customer.idCustomer) as total"),
            DB::raw("count(if(customer.customerRegisterStatusId = 1, 1, null)) as active"),
            DB::raw("count(if(customer.customerRegisterStatusId = 2, 1, null)) as pending"),
            DB::raw("count(if(customer.customerRegisterStatusId = 3, 1, null)) as blocked")
        )
            ->join('levelAccess', 'customer.userId', 'levelAccess.userId')
            ->join('userType', 'levelAccess.userTypeId', 'userType.idUserType')
            ->join('user', 'customer.userId', 'user.idUser')
            ->leftJoin('cityArea', function (JoinClause $query) {
                $query
                    ->on('user.cityId', 'cityArea.cityId')
                    ->where('cityArea.statusId', StatusConst::ACTIVE);
            })
            ->where('userType.idUserType', UserTypeConst::CUSTOMER)
            ->where('user.statusId', StatusConst::ACTIVE)
            ->when(isset($cityId), function (Builder $query) use ($cityId) {
                $query->where('cityArea.cityId', $cityId);
            })
            ->when(isset($authRole->support) && !$authRole->support, function (Builder $query) use ($authRole) {
                $query->whereIn('cityArea.cityId', function (\Illuminate\Database\Query\Builder $query) use ($authRole) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleCity.roleId', $authRole->id);
                });
            })
            ->groupBy('userType.idUserType')
            ->get();
    }

    public function getCountCustomersInsidePolygon(Role $authRole = null, ?int $cityId = null): Collection
    {
        return CustomerRO::query()->select(
            'userType.name as type',
            DB::raw("count(customer.idCustomer) as total"),
            DB::raw("count(if(customer.customerRegisterStatusId = 1, 1, null)) as active"),
            DB::raw("count(if(customer.customerRegisterStatusId = 2, 1, null)) as pending"),
            DB::raw("count(if(customer.customerRegisterStatusId = 3, 1, null)) as blocked")
        )
            ->join('levelAccess', 'customer.userId', 'levelAccess.userId')
            ->join('userType', 'levelAccess.userTypeId', 'userType.idUserType')
            ->join('user', 'customer.userId', 'user.idUser')
            ->join('cityArea', function (JoinClause $query) {
                $query->on('user.cityId', 'cityArea.cityId')
                    ->orWhereRaw('(ST_CONTAINS(cityArea.polygon, POINT(user.last_lat, user.last_lon)))');
            })
            ->where('userType.idUserType', UserTypeConst::CUSTOMER)
            ->where('user.statusId', StatusConst::ACTIVE)
            ->where('cityArea.statusId', StatusConst::ACTIVE)
            ->when(isset($cityId), function (Builder $query) use ($cityId) {
                $query->where('cityArea.cityId', $cityId);
            })
            ->when(isset($authRole->support) && !$authRole->support, function (Builder $query) use ($authRole) {
                $query->whereIn('cityArea.cityId', function (\Illuminate\Database\Query\Builder $query) use ($authRole) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleCity.roleId', $authRole->id);
                });
            })
            ->groupBy('userType.idUserType')
            ->get();
    }

    /**
     * @param string $status Status real da trip (ver TripConst::STATUSES) ou o valor virtual
     *                       'unattended', que expande para a mesma regra usada em tripQuantities()
     *                       para "não atendida": not_answered OU back_off OU (canceled sem driverId).
     */
    public function getTripsByStatus(string $status, int $cityId = null, string $canceledBy = null, string $date = null, string $dateStart = null, string $dateEnd = null): array
    {
        $query = TripRO::query()
            ->join('tripPaymentForm', 'trip.tripPaymentFormId', 'tripPaymentForm.idTripPaymentForm')
            ->join('user as customerUser', 'trip.userId', 'customerUser.idUser')
            ->leftJoin('origin', 'trip.originId', 'origin.idOrigin')
            ->leftJoin('destination', 'trip.destinationId', 'destination.idDestination')
            ->leftJoin('tripCustomer', 'trip.tripCustomerId', 'tripCustomer.id')
            ->leftJoin('customer as customerTrip', 'trip.customerId', 'customerTrip.idCustomer')
            ->leftJoin('cancellationReasons', 'trip.cancellationReasonsId', 'cancellationReasons.idCancellationReasons')
            ->where(function (Builder $query) use ($status) {
                if ($status === 'unattended') {
                    $query->where('trip.status', TripConst::NOT_ANSWERED)
                        ->orWhere('trip.status', TripConst::BACK_OFF)
                        ->orWhere(function (Builder $subQuery) {
                            $subQuery->where('trip.status', TripConst::CANCELED)
                                ->whereNull('trip.driverId');
                        });
                    return;
                }
                $query->where('trip.status', $status);
            })
            ->when(isset($cityId), function (Builder $query) use ($cityId) {
                $query->where('trip.cityId', $cityId);
            })
            ->when(isset($canceledBy), function (Builder $query) use ($canceledBy) {
                $query->where('trip.canceledBy', $canceledBy);
            })
            ->when(isset($dateStart) && isset($dateEnd), function (Builder $query) use ($dateStart, $dateEnd) {
                // Prioridade: se tiver dateStart e dateEnd, usa intervalo
                $query->whereBetween('trip.date', [
                    Carbon::parse($dateStart)->startOfDay(),
                    Carbon::parse($dateEnd)->endOfDay()
                ]);
            })
            ->when(isset($dateStart) && !isset($dateEnd) && !isset($date), function (Builder $query) use ($dateStart) {
                // Se tiver apenas dateStart (sem dateEnd e sem date)
                $query->where('trip.date', '>=', Carbon::parse($dateStart)->startOfDay());
            })
            ->when(!isset($dateStart) && isset($dateEnd) && !isset($date), function (Builder $query) use ($dateEnd) {
                // Se tiver apenas dateEnd (sem dateStart e sem date)
                $query->where('trip.date', '<=', Carbon::parse($dateEnd)->endOfDay());
            })
            ->when(isset($date) && !isset($dateStart) && !isset($dateEnd), function (Builder $query) use ($date) {
                // Se tiver apenas date (sem intervalo)
                $query->whereDate('trip.date', $date);
            })
            ->orderByDesc('trip.date')
            ->limit(self::TRIPS_BY_STATUS_LIMIT)
            ->select(
                'trip.idTrip',
                'trip.tripReference',
                'trip.date',
                'trip.price',
                'trip.status',
                'trip.canceledBy',
                DB::raw('
                    CASE
                        WHEN trip.tripCustomerId IS NOT NULL THEN tripCustomer.name
                        WHEN trip.customerId IS NOT NULL THEN customerTrip.name
                        ELSE customerUser.name
                    END AS customerName
                '),
                DB::raw('
                    CASE
                        WHEN trip.tripCustomerId IS NOT NULL THEN tripCustomer.phone
                        WHEN trip.customerId IS NOT NULL THEN customerTrip.phone
                        ELSE customerUser.phone
                    END AS customerPhone
                '),
                'cancellationReasons.name AS cancelReason',
                'origin.address AS originAddress',
                'origin.latitude AS originLatitude',
                'origin.longitude AS originLongitude',
                'destination.address AS destinationAddress',
                'tripPaymentForm.name AS paymentForm'
            );

        return $query->get()->toArray();
    }

    /**
     * Busca todos os clientes ativos da cidade que possuem localização (last_lat e last_lon)
     * 
     * @param int|null $cityId
     * @return array
     */
    public function getActiveCustomersLast10Minutes(?int $cityId = null): array
    {
        $query = DB::table('user')
            ->join('levelAccess', 'user.idUser', 'levelAccess.userId')
            ->join('userType', 'levelAccess.userTypeId', 'userType.idUserType')
            ->join('customer', 'user.idUser', 'customer.userId')
            ->leftJoin('trip', 'user.idUser', 'trip.userId')
            ->where('user.statusId', StatusConst::ACTIVE)
            ->where('userType.idUserType', UserTypeConst::CUSTOMER)
            ->whereNotNull('user.last_lat')
            ->whereNotNull('user.last_lon')

            // Aqui a condição que funciona mesmo com timezone SYSTEM no MySQL
            ->whereRaw('user.updated_at >= UTC_TIMESTAMP() - INTERVAL 10 MINUTE')

            ->when(isset($cityId), function ($query) use ($cityId) {
                $query->where('user.cityId', $cityId);
            })
            ->select(
                'user.idUser',
                'user.name',
                'user.nickname',
                'user.email',
                'user.phone',
                'user.document',
                'user.cityId',
                'user.last_lat as latitude',
                'user.last_lon as longitude',
                'customer.idCustomer',
                'customer.profileImage',
                DB::raw('MAX(trip.idTrip) as lastTripId'),
                DB::raw('MAX(trip.tripReference) as lastTripReference'),
                DB::raw('MAX(trip.date) as lastTripDate')
            )
            ->groupBy(
                'user.idUser',
                'user.name',
                'user.nickname',
                'user.email',
                'user.phone',
                'user.document',
                'user.cityId',
                'user.last_lat',
                'user.last_lon',
                'customer.idCustomer',
                'customer.profileImage'
            )
            ->orderByDesc(DB::raw('MAX(trip.date)'))
            ->orderBy('user.name')
            ->get();

        return $query->toArray();
    }


    public function getActiveCustomersAllTime(?int $cityId = null): array
    {
        $query = DB::table('user')
            ->join('levelAccess', 'user.idUser', 'levelAccess.userId')
            ->join('userType', 'levelAccess.userTypeId', 'userType.idUserType')
            ->join('customer', 'user.idUser', 'customer.userId') // 👈 INNER JOIN
            ->leftJoin('trip', 'user.idUser', 'trip.userId')
            ->where('user.statusId', StatusConst::ACTIVE)
            ->where('userType.idUserType', UserTypeConst::CUSTOMER)
            ->whereNotNull('user.last_lat')
            ->whereNotNull('user.last_lon')
            ->when(isset($cityId), function ($query) use ($cityId) {
                $query->where('user.cityId', $cityId);
            })
            ->select(
                'user.idUser',
                'user.name',
                'user.nickname',
                'user.email',
                'user.phone',
                'user.document',
                'user.cityId',
                'user.last_lat as latitude',
                'user.last_lon as longitude',
                'customer.idCustomer',
                'customer.profileImage',
                DB::raw('MAX(trip.idTrip) as lastTripId'),
                DB::raw('MAX(trip.tripReference) as lastTripReference'),
                DB::raw('MAX(trip.date) as lastTripDate')
            )
            ->groupBy(
                'user.idUser',
                'user.name',
                'user.nickname',
                'user.email',
                'user.phone',
                'user.document',
                'user.cityId',
                'user.last_lat',
                'user.last_lon',
                'customer.idCustomer',
                'customer.profileImage'
            )
            ->orderByDesc(DB::raw('MAX(trip.date)'))
            ->orderBy('user.name')
            ->get();

        return $query->toArray();
    }



    
}
