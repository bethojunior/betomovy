<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/06/2019
 * Time: 16:41
 */

namespace App\Repositories\Trip;


use App\Constants\Balance\BalanceFlowTypeConst;
use App\Constants\Balance\FlowTypeConst;
use App\Constants\PaginationConst;
use App\Constants\Trip\TripAuditConst;
use App\Constants\Trip\TripConst;
use App\Constants\Trip\RewardTripTypeConst;
use App\Contracts\Repository\AbstractRepository;
use Illuminate\Database\Query\JoinClause;
use App\Models\Trip\Trip;
use App\Models\Trip\TripPaymentForm;
use App\Models\User\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TripRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(Trip::class);
    }

    public function findAll(array $request = [], int $userId = null, int $cityId = null)
    {
        $query = $this->getModel()::query()
            ->select('trip.idTrip', 'trip.date')
            ->when(isset($cityId), function (Builder $query) use ($cityId) {
                $query->where('trip.cityId', $cityId);
            })
            ->when(isset($request['date']), function (Builder $query) use ($request) {
                $dates = explode(',', $request['date']);
                $dates[0] = Carbon::parse($dates[0])->startOfDay();
                $dates[1] = Carbon::parse($dates[1])->endOfDay();
                $query->whereBetween('trip.date', $dates);
            })
            ->when(isset($request['driverId']), function (Builder $query) use ($request) {
                $query->where('trip.driverId', $request['driverId']);
            })
            ->when(isset($request['status']), function (Builder $query) use ($request) {
                $query->where('trip.status', $request['status']);
            })
            ->when(isset($request['customerUserId']), function (Builder $query) use ($request) {
                $query->where('trip.userId', $request['customerUserId']);
            })
            ->when(isset($request['partnerUserId']), function (Builder $query) use ($request) {
                $query->where('trip.userId', $request['partnerUserId']);
            })
            ->orderByDesc('trip.date');

        $paginator = $query->paginate($request['per_page'] ?? 10);

        if ($paginator->isEmpty()) {
            return $paginator;
        }

        $tripIds = $paginator->getCollection()->pluck('idTrip');

        $tripsWithJoins = $this->getModel()::select(
            'trip.idTrip',
            'trip.tripReference',
            'trip.date',
            'trip.price',
            'trip.driverId',
            'trip.userId',
            'trip.customerId',
            'trip.tripCallTypeId',
            'trip.flow',
            'tct.name AS callType',
            DB::raw('CASE
                   WHEN trip.centralCustomerId IS NOT NULL THEN centralCustomer.name
                   WHEN trip.tripCustomerId IS NOT NULL THEN cp.name
                   WHEN trip.customerId IS NOT NULL THEN ct.name
                   ELSE uc.name
            END AS customerName'),
            'trip.status',
            'trip.canceledBy',
            'tpf.name AS paymentForm',
            'ta.situation',
            DB::raw('CASE
                   WHEN trip.centralCustomerId IS NOT NULL THEN centralCustomer.phone
                   ELSE uc.phone
            END AS phone')
        )
            ->whereIn('trip.idTrip', $tripIds)
            ->join('tripAudit as ta', 'trip.tripAuditId', 'ta.id')
            ->join('tripCallType as tct', 'trip.tripCallTypeId', 'tct.id')
            ->join('tripPaymentForm as tpf', 'trip.tripPaymentFormId', 'tpf.idTripPaymentForm')
            ->join('user as uc', 'trip.userId', 'uc.idUser')
            ->leftJoin('tripCustomer as cp', 'trip.tripCustomerId', 'cp.id')
            ->leftJoin('customer as ct', 'trip.customerId', 'ct.idCustomer')
            ->leftJoin('centralCustomer', 'trip.centralCustomerId', 'centralCustomer.id')
            ->with([
                'tripWayPoints' => function (HasMany $query) {
                    $query
                        ->select([
                            'tripReference',
                            'latitude',
                            'longitude',
                            'address',
                            'confirmed',
                            'created_at'
                        ]);
                },
            ])
            ->orderByDesc('trip.date')
            ->get();

        $paginator->setCollection($tripsWithJoins);

        return $paginator;
    }

    public function findWay(string $tripReference)
    {
        return $this->getModel()::query()->join('origin', 'trip.originId', 'origin.idOrigin')
            ->join('destination', 'trip.destinationId', 'destination.idDestination')
            ->join('tripType', 'trip.tripTypeId', 'tripType.idTripType')
            ->leftJoin('driver', 'trip.driverId', 'driver.idDriver')
            ->leftJoin('user as driverUser', 'driver.userId', 'driverUser.idUser')
            ->select(
                'origin.address as originAddress',
                'destination.address as destinationAddress',
                'tripType.type as tripType',
                'driverUser.name as driverName',
                'driverUser.phone as driverPhone'
            )
            ->where('trip.tripReference', $tripReference)
            ->first();
    }

    public function totalValue(array $request = [], int $userId = null, int $cityId = null)
    {
        return $this->getModel()::select(
            DB::raw('ROUND(SUM(trip.price), 2) as totalValue')
        )
            ->when(isset($cityId), function (Builder $query) use ($cityId) {
                $query->where('trip.cityId', $cityId);
            })
            ->when(isset($request['date']), function (Builder $query) use ($request) {
                $dates = explode(',', $request['date']);
                $dates[0] = Carbon::parse($dates[0])->startOfDay();
                $dates[1] = Carbon::parse($dates[1])->endOfDay();
                $query->whereBetween('trip.date', $dates);
            })
            ->when(isset($request['driverId']), function (Builder $query) use ($request) {
                $query->where('trip.driverId', $request['driverId']);
            })
            ->when(isset($request['status']), function (Builder $query) use ($request) {
                $query->where('trip.status', $request['status']);
            })
            ->when(isset($request['customerUserId']), function (Builder $query) use ($request) {
                $query->where('trip.userId', $request['customerUserId']);
            })
            ->when(isset($request['partnerUserId']), function (Builder $query) use ($request) {
                $query->where('trip.userId', $request['partnerUserId']);
            })
            ->first()->totalValue;
    }

    public function findByReference($tripReference, $with = [])
    {
        return $this->getModel()
            ::where('tripReference', $tripReference)
            ->with($with)
            ->first();
    }

    public function findFully($tripReference)
    {
        return $this->getModel()
            ::with(['tripHistory' => function (HasMany $query) {
                $query->orderByDesc('date');
                $query->first();
            }])
            ->where('trip.tripReference', $tripReference)
            ->join('tripAudit', 'trip.tripAuditId', '=', 'tripAudit.id')
            ->join('tripPaymentForm', 'trip.tripPaymentFormId', '=', 'tripPaymentForm.idTripPaymentForm')
            ->join('tripType', 'trip.tripTypeId', '=', 'tripType.idTripType')
            ->join('tripCallType as tc', 'trip.tripCallTypeId', '=', 'tc.id')
            ->leftJoin('rewardCampaignTrip as rCT', 'trip.tripReference', '=', 'rCT.tripReference')
            ->leftJoin('driverCommissionAnotherFee as dCAF', 'dCAF.driverCommissionId', '=', 'trip.driverCommissionId')
            ->leftJoin('balanceFlow as bfpf', function (JoinClause $join) {
                $join->where(function($query) {
                    $query->where('bfpf.balanceFlowTypeId', BalanceFlowTypeConst::BALANCE_OUT_RATE_PAYMENT_FORM)
                        ->orWhere('bfpf.balanceFlowTypeId', BalanceFlowTypeConst::BALANCE_OUT_RATE_PAYMENT_FORM_BLOCKED);
                })
                    ->on('bfpf.tripReference', 'trip.tripReference');
            })
            ->leftJoin('origin as o', 'trip.originId', '=', 'o.idOrigin')
            ->leftJoin('destination as d', 'trip.destinationId', '=', 'd.idDestination')
            ->leftJoin('establishment as est', 'trip.establishmentId', '=', 'est.idEstablishment')
            ->leftJoin('station as s', 'trip.stationId', '=', 's.idStation')
            ->leftJoin('driver', 'trip.driverId', '=', 'driver.idDriver')
            ->leftJoin('levelAccess as lad', 'driver.userId', '=', 'lad.userId')
            ->leftJoin('userType as utd', 'lad.userTypeId', '=', 'utd.idUserType')
            ->leftJoin('user as ud', 'driver.userId', '=', 'ud.idUser')
            ->leftJoin('user as uc', 'trip.userId', '=', 'uc.idUser')
            ->leftJoin('customer as c', 'uc.idUser', '=', 'c.userId')
            ->leftJoin('customer as ct', 'trip.customerId', '=', 'ct.idCustomer')
            ->leftJoin('tripCustomer as cp', 'trip.tripCustomerId', '=', 'cp.id')
            ->leftJoin('centralCustomer', 'trip.centralCustomerId', '=', 'centralCustomer.id')
            ->leftJoin('user as centralCustomerUser', 'centralCustomer.userId', '=', 'centralCustomerUser.idUser')
            ->leftJoin('customer as centralCustomerProfile', 'centralCustomerUser.idUser', '=', 'centralCustomerProfile.userId')
            ->leftJoin('city', 'trip.cityId', '=', 'city.id')
            ->leftJoin('driverCommission as dC', 'trip.driverCommissionId', '=', 'dC.idDriverCommission')
            ->leftJoin('rewardTrip as rT', 'trip.rewardTripId', '=', 'rT.id')
            ->leftJoin('cancellationReasons as cR', 'trip.cancellationReasonsId', '=', 'cR.idCancellationReasons')
            ->leftJoin('tripCancellationCustomerFee as tCCF_G', 'trip.tripReference', '=', 'tCCF_G.tripReference') // gerou a taxa
            ->leftJoin('tripCancellationCustomerFee as tCCF_P', 'trip.tripReference', '=', 'tCCF_P.paid_tripReference') // pagou a taxa
            ->leftJoin('tripDiscountCoupon as tDC', 'trip.tripReference', '=', 'tDC.tripReference')
            ->leftJoin('userDiscountCoupon as uDC', 'tDC.userDiscountCouponId', '=', 'uDC.id')
            ->leftJoin('discountCoupon as dC2', 'uDC.discountCouponId', '=', 'dC2.id')
            ->select([
                'trip.idTrip',
                'trip.tripReference',
                'trip.date',
                'trip.endDate',
                'trip.price',
                'trip.usedFakeGps',
                'trip.multiplierDynamic',
                'trip.priceId',
                'trip.driverId',
                'trip.userId',
                'trip.tripTypeId',
                'trip.status',
                'trip.canceledBy',
                'tripPaymentForm.name AS tripPaymentForm',
                'tripType.type AS tripType',
                'tripAudit.situation',
                'trip.originId',
                'trip.destinationId',
                'trip.description',
                'trip.cityId',
                'nome AS cityName',
                'ud.name as driverName',
                'driver.profileImage as driverPhoto',
                'lad.userTypeId as driverTypeId',
                'utd.name as driverType',
                'ud.phone as driverPhone',
                'trip.distance as distance',
                'trip.estimatedTripTime as estimatedTripTime',
                'trip.tripTypeId as tripTypeId',
                'trip.tripCallTypeId as tripCallTypeId',
                DB::raw('IF(trip.customerId IS NOT NULL, trip.customerId, c.idCustomer) as customerId'),
                'trip.zoneId as zoneId',
                'trip.tripPaymentFormId as tripPaymentFormId',
                'uc.platform as platform',
                'tCCF_G.feeValue as cancellationFee_generated',
                'tCCF_G.paid_tripReference as tripReferenceCancellationFee_paid',
                'tCCF_P.feeValue as cancellationFee_paid',
                'tCCF_P.tripReference as tripReferenceCancellationFee_generated',
                DB::raw('round(bfpf.value, 2) as paymentFormFee'),
                'cR.name as cancellationReasons',
                'dC2.code as discountCoupon',
                DB::raw('round((ifnull(rT.value, 0) + ifnull(rCT.value, 0)), 2) as driverReward'),
                DB::raw('(case
                    when (trip.centralCustomerId is not null) then convert(centralCustomer.name using utf8mb4)
                    when (trip.tripCustomerId is not null) then convert(cp.name using utf8mb4)
                    when (trip.customerId is not null) then convert(ct.name using utf8mb4)
                    else uc.name end) as customerName'),
                DB::raw('(case
                    when (trip.tripCustomerId is not null) then true
                    when (trip.customerId is not null) then true
                    else false end) as isForThirdParty'),
                DB::raw('(
                    CASE
                        WHEN (trip.centralCustomerId IS NOT NULL) THEN centralCustomerProfile.profileImage
                        WHEN (driver.userId = uc.idUser) THEN driver.profileImage
                        ELSE c.profileImage
                    END
                ) as customerPhoto'),
                DB::raw('IF(driver.userId = uc.idUser, true, false) as driverIsTheCustomer'),
                'uc.name as holderName',
                'uc.franchiseId as franchiseId',
                DB::raw('(case
                    when (trip.centralCustomerId is not null) then convert(centralCustomer.phone using utf8mb4)
                    when (trip.tripCustomerId is not null) then convert(cp.phone using utf8mb4)
                    else uc.phone
                    end) as customerPhone'),
                'trip.tripAuditId as tripAuditId',
                'tripPaymentForm.name as paymentForm',
                'tc.name as tripCallType',
                'trip.favoriteDrivers as favoriteDrivers',
                'city.nome as cityName',
                'trip.rewardTripId as rewardTripId',
                'trip.driverCommissionId as driverCommissionId',
                'trip.partnerCommissionId as partnerCommissionId',
                'trip.centralId as centralId',
                DB::raw('(select tR.rating
                from tripRating tR
                where ((tR.userWhoEvaluated = driver.userId) and (trip.tripReference = tR.tripReference))
                limit 1) as evaluationByDriver'),
                DB::raw('(select tR.rating
                from tripRating tR
                where ((tR.userWhoEvaluated = uc.idUser) and (trip.tripReference = tR.tripReference))
                limit 1) as evaluationByCustomer'),
                DB::raw('if((dC.valueType = \'$\'), round(dC.value, 2),
                round(((trip.price - ifnull(tCCF_P.feeValue, 0)) * (dC.value / 100)), 2)) as appValue'),
                DB::raw('if((dCAF.valueType = \'$\'), round((ifnull(dCAF.tax_value, 0) + ifnull(dCAF.another_value, 0)), 2),
                round(((trip.price - ifnull(tCCF_P.feeValue, 0)) * ((ifnull(dCAF.tax_value, 0) + ifnull(dCAF.another_value, 0)) / 100)), 2)) as anotherFeeValue'),
                DB::raw('round(ifnull((select sum(if(tax.valueType = \'$\', tax.value, trip.price * tax.value / 100))
                    from tripTax
                    inner join tax on tax.id = tripTax.taxId
                    where tripTax.tripId = trip.idTrip), 0), 2) as dynamicTaxValue'),
                DB::raw('round(
                    trip.price
                    - if((dC.valueType = \'$\'), dC.value, (trip.price - ifnull(tCCF_P.feeValue, 0)) * (dC.value / 100))
                    - if((dCAF.valueType = \'$\'), (ifnull(dCAF.tax_value, 0) + ifnull(dCAF.another_value, 0)),
                        (trip.price - ifnull(tCCF_P.feeValue, 0)) * ((ifnull(dCAF.tax_value, 0) + ifnull(dCAF.another_value, 0)) / 100))
                    - ifnull(bfpf.value, 0)
                    - ifnull(tCCF_P.feeValue, 0)
                    - ifnull((select sum(if(tax.valueType = \'$\', tax.value, trip.price * tax.value / 100))
                        from tripTax
                        inner join tax on tax.id = tripTax.taxId
                        where tripTax.tripId = trip.idTrip), 0)
                    + (ifnull(rT.value, 0) + ifnull(rCT.value, 0))
                , 2) as driverValue'),
                DB::raw('if((trip.establishmentId is not null), convert(est.latitude using utf8mb4),
                o.latitude) as originLatitude'),
                DB::raw('if((trip.establishmentId is not null), convert(est.longitude using utf8mb4),
                o.longitude) as originLongitude'),
                'o.neighborhood as originNeighborhood',
                DB::raw('if((trip.establishmentId is not null), convert(est.fantasyName using utf8mb4),
                o.address) as originAddress'),
                DB::raw('if((trip.stationId is not null), s.latitude, d.latitude) as destinationLatitude'),
                DB::raw('if((trip.stationId is not null), s.longitude, d.longitude) as destinationLongitude'),
                'd.neighborhood as destinationNeighborhood',
                DB::raw('if((trip.stationId is not null), s.name, d.address) as destinationAddress')
            ])
            ->with([
                'driverCommission' => function (BelongsTo $query) {
                    $query->select([
                        "idDriverCommission",
                        "value",
                        "valueType",
                        "cityId",
                        "tripTypeId",
                        "disableOnPromotion",
                        "statusId",
                        "created_at",
                        "updated_at"
                    ]);
                },
                'partnerCommission' => function (BelongsTo $query) {
                    $query->select([
                        "id",
                        "partnerCommissionType",
                        "partnerCommissionValue",
                    ]);
                },
                'tripWayPoints',
                'fare',
                'recalculatedTrip',
                'tripLongDistance',
                'rewardCampaignTrip' => function (HasMany $query) {
                    $query
                        ->join('rewardTripType', 'rewardTripTypeId', '=', 'rewardTripType.id')
                        // condiciona o join ao tipo certo pra não vazar o código pros outros bônus
                        ->leftJoin('tripDiscountCoupon', function (JoinClause $join) {
                            $join->on('tripDiscountCoupon.tripReference', '=', 'rewardCampaignTrip.tripReference')
                                ->where('rewardCampaignTrip.rewardTripTypeId', RewardTripTypeConst::REWARD_TRIP_DISCOUNT_COUPON);
                        })
                        ->leftJoin('userDiscountCoupon', 'userDiscountCoupon.id', '=', 'tripDiscountCoupon.userDiscountCouponId')
                        ->leftJoin('discountCoupon', 'discountCoupon.id', '=', 'userDiscountCoupon.discountCouponId')
                        ->select(
                            'rewardCampaignTrip.id',
                            'rewardTripType.name AS rewardTripType',
                            'rewardCampaignTrip.value',
                            'rewardCampaignTrip.rewardTripTypeId',
                            'rewardCampaignTrip.tripReference',
                            'discountCoupon.code AS discountCouponCode'
                        );
                },
                'rewardTripLongDistance' => function (HasOne $query) {
                    $query
                        ->join('rewardTripType', 'rewardTripTypeId', '=', 'rewardTripType.id')
                        ->select(
                            'rewardTrip.id',
                            'rewardTripType.name AS rewardTripType',
                            'rewardTrip.value',
                            'rewardTrip.rewardTripTypeId',
                            'rewardTrip.tripReference'
                        );
                },
                'tolls' => function (BelongsToMany $query) {
                    $query
                        ->select(
                            'toll.id',
                            'name',
                            'address',
                            'value'
                        )
                        ->withoutGlobalScopes();
                },
                'driverCalled' => function (HasMany $query) {
                    $query
                        ->with(['driver' => function ($q) {
                            $q->with(['user' => function ($uq) {
                                $uq->select('idUser', 'name', 'phone');
                            }]);
                        }])
                        ->groupBy('driverId');
                },
                'taxes' => function (BelongsToMany $query) {
                    $query->select(
                        'tax.id',
                        'name',
                        'value',
                        'valueType',
                        'description',
                        'cityId',
                        'tripTypeId',
                        'chargeBy'
                    )
                        ->withTrashed();
                }
            ])
            ->first();
    }

    public function findFullyRideTrip($tripReference)
    {
        return $this->getModel()
            ::with(['tripHistory' => function (HasMany $query) {
                $query->orderByDesc('date');
                $query->first();
            }])
            ->where('trip.tripReference', $tripReference)
            ->join('tripAudit', 'trip.tripAuditId', '=', 'tripAudit.id')
            ->join('tripPaymentForm', 'trip.tripPaymentFormId', '=', 'tripPaymentForm.idTripPaymentForm')
            ->join('tripType', 'trip.tripTypeId', '=', 'tripType.idTripType')
            ->join('tripCallType as tc', 'trip.tripCallTypeId', '=', 'tc.id')
            ->leftJoin('rewardCampaignTrip as rCT', 'trip.tripReference', '=', 'rCT.tripReference')
            ->leftJoin('driverCommissionAnotherFee as dCAF', 'dCAF.driverCommissionId', '=', 'trip.driverCommissionId')
            ->leftJoin('balanceFlow as bfpf', function (JoinClause $join) {
                $join->where(function($query) {
                    $query->where('bfpf.balanceFlowTypeId', BalanceFlowTypeConst::BALANCE_OUT_RATE_PAYMENT_FORM)
                        ->orWhere('bfpf.balanceFlowTypeId', BalanceFlowTypeConst::BALANCE_OUT_RATE_PAYMENT_FORM_BLOCKED);
                })
                    ->on('bfpf.tripReference', 'trip.tripReference');
            })
            ->leftJoin('origin as o', 'trip.originId', '=', 'o.idOrigin')
            ->leftJoin('destination as d', 'trip.destinationId', '=', 'd.idDestination')
            ->leftJoin('establishment as est', 'trip.establishmentId', '=', 'est.idEstablishment')
            ->leftJoin('station as s', 'trip.stationId', '=', 's.idStation')
            ->leftJoin('driver', 'trip.driverId', '=', 'driver.idDriver')
            ->leftJoin('levelAccess as lad', 'driver.userId', '=', 'lad.userId')
            ->leftJoin('userType as utd', 'lad.userTypeId', '=', 'utd.idUserType')
            ->leftJoin('user as ud', 'driver.userId', '=', 'ud.idUser')
            ->leftJoin('user as uc', 'trip.userId', '=', 'uc.idUser')
            ->leftJoin('customer as c', 'uc.idUser', '=', 'c.userId')
            ->leftJoin('customer as ct', 'trip.customerId', '=', 'ct.idCustomer')
            ->leftJoin('tripCustomer as cp', 'trip.tripCustomerId', '=', 'cp.id')
            ->leftJoin('city', 'trip.cityId', '=', 'city.id')
            ->leftJoin('driverCommission as dC', 'trip.driverCommissionId', '=', 'dC.idDriverCommission')
            ->leftJoin('rewardTrip as rT', 'trip.rewardTripId', '=', 'rT.id')
            ->leftJoin('cancellationReasons as cR', 'trip.cancellationReasonsId', '=', 'cR.idCancellationReasons')
            ->leftJoin('tripCancellationCustomerFee as tCCF', 'trip.tripReference', '=', 'utd.idUserType')
            ->leftJoin('tripDiscountCoupon as tDC', 'trip.tripReference', '=', 'tDC.tripReference')
            ->leftJoin('userDiscountCoupon as uDC', 'tDC.userDiscountCouponId', '=', 'uDC.id')
            ->leftJoin('discountCoupon as dC2', 'uDC.discountCouponId', '=', 'dC2.id')
            ->select([
                'trip.idTrip',
                'trip.tripReference',
                'trip.date',
                'trip.endDate',
                'trip.usedFakeGps',
                'trip.multiplierDynamic',
                'trip.priceId',
                'trip.driverId',
                'trip.userId',
                'trip.tripTypeId',
                'trip.status',
                'trip.canceledBy',
                'tripPaymentForm.name AS tripPaymentForm',
                'tripType.type AS tripType',
                'tripAudit.situation',
                'trip.originId',
                'trip.destinationId',
                'trip.description',
                'trip.cityId',
                'nome AS cityName',
                'ud.name as driverName',
                'driver.profileImage as driverPhoto',
                'lad.userTypeId as driverTypeId',
                'utd.name as driverType',
                'ud.phone as driverPhone',
                'trip.distance as distance',
                'trip.estimatedTripTime as estimatedTripTime',
                'trip.tripTypeId as tripTypeId',
                'trip.tripCallTypeId as tripCallTypeId',
                DB::raw('IF(trip.customerId IS NOT NULL, trip.customerId, c.idCustomer) as customerId'),
                'trip.zoneId as zoneId',
                'trip.tripPaymentFormId as tripPaymentFormId',
                'uc.platform as platform',
                'tCCF.feeValue as cancellationFee',
                'cR.name as cancellationReasons',
                'dC2.code as discountCoupon',
                DB::raw('round((ifnull(rT.value, 0) + ifnull(rCT.value, 0)), 2) as driverReward'),
                DB::raw('(case
                    when (trip.tripCustomerId is not null) then convert(cp.name using utf8mb4)
                    when (trip.customerId is not null) then convert(ct.name using utf8mb4)
                    else uc.name end) as customerName'),
                DB::raw('(case
                    when (trip.tripCustomerId is not null) then true
                    when (trip.customerId is not null) then true
                    else false end) as isForThirdParty'),
                DB::raw('round(bfpf.value, 2) as paymentFormFee'),
                DB::raw('(
                    CASE
                        WHEN (driver.userId = uc.idUser) THEN driver.profileImage
                        ELSE c.profileImage
                    END
                ) as customerPhoto'),
                DB::raw('IF(driver.userId = uc.idUser, true, false) as driverIsTheCustomer'),
                'uc.name as holderName',
                'uc.franchiseId as franchiseId',
                DB::raw('if((trip.tripCustomerId is not null), convert(cp.phone using utf8mb4),
                uc.phone) as customerPhone'),
                'trip.tripAuditId as tripAuditId',
                'tripPaymentForm.name as paymentForm',
                'tc.name as tripCallType',
                'trip.favoriteDrivers as favoriteDrivers',
                'city.nome as cityName',
                'trip.rewardTripId as rewardTripId',
                'trip.driverCommissionId as driverCommissionId',
                'trip.centralId as centralId',
                DB::raw('(select tR.rating
                from tripRating tR
                where ((tR.userWhoEvaluated = driver.userId) and (trip.tripReference = tR.tripReference))
                limit 1) as evaluationByDriver'),
                DB::raw('(select tR.rating
                from tripRating tR
                where ((tR.userWhoEvaluated = uc.idUser) and (trip.tripReference = tR.tripReference))
                limit 1) as evaluationByCustomer'),
                DB::raw('if((dC.valueType = \'$\'), round(dC.value, 2),
                round(((trip.price - ifnull(tCCF_P.feeValue, 0)) * (dC.value / 100)), 2)) as appValue'),
                DB::raw('if((dCAF.valueType = \'$\'), round((ifnull(dCAF.tax_value, 0) + ifnull(dCAF.another_value, 0)), 2),
                round(((trip.price - ifnull(tCCF_P.feeValue, 0)) * ((ifnull(dCAF.tax_value, 0) + ifnull(dCAF.another_value, 0)) / 100)), 2)) as anotherFeeValue'),
                DB::raw('round(ifnull((select sum(if(tax.valueType = \'$\', tax.value, trip.price * tax.value / 100))
                    from tripTax
                    inner join tax on tax.id = tripTax.taxId
                    where tripTax.tripId = trip.idTrip), 0), 2) as dynamicTaxValue'),
                DB::raw('round(
                    trip.price
                    - if((dC.valueType = \'$\'), dC.value, (trip.price - ifnull(tCCF_P.feeValue, 0)) * (dC.value / 100))
                    - if((dCAF.valueType = \'$\'), (ifnull(dCAF.tax_value, 0) + ifnull(dCAF.another_value, 0)),
                        (trip.price - ifnull(tCCF_P.feeValue, 0)) * ((ifnull(dCAF.tax_value, 0) + ifnull(dCAF.another_value, 0)) / 100))
                    - ifnull(bfpf.value, 0)
                    - ifnull(tCCF_P.feeValue, 0)
                    - ifnull((select sum(if(tax.valueType = \'$\', tax.value, trip.price * tax.value / 100))
                        from tripTax
                        inner join tax on tax.id = tripTax.taxId
                        where tripTax.tripId = trip.idTrip), 0)
                    + (ifnull(rT.value, 0) + ifnull(rCT.value, 0))
                , 2) as driverValue'),
                DB::raw('if((trip.establishmentId is not null), convert(est.latitude using utf8mb4),
                o.latitude) as originLatitude'),
                DB::raw('if((trip.establishmentId is not null), convert(est.longitude using utf8mb4),
                o.longitude) as originLongitude'),
                'o.neighborhood as originNeighborhood',
                DB::raw('if((trip.establishmentId is not null), convert(est.fantasyName using utf8mb4),
                o.address) as originAddress'),
                DB::raw('if((trip.stationId is not null), s.latitude, d.latitude) as destinationLatitude'),
                DB::raw('if((trip.stationId is not null), s.longitude, d.longitude) as destinationLongitude'),
                'd.neighborhood as destinationNeighborhood',
                DB::raw('if((trip.stationId is not null), s.name, d.address) as destinationAddress'),
            ])
            ->with([
                'ride' => function ($query) {
                    $query->with([
                        'riders' => function ($query) {
                            $query->select(
                                'rider.id',
                                'value as valuePerSeat',
                                'rideId',
                                'rtc.id as riderTripCustomerId',
                                DB::raw("IFNULL(tC.name, u.name) AS name"),
                                DB::raw("IFNULL(tC.phone, u.phone) AS phone"),
                                'tripPaymentForm.name AS tripPaymentForm',
                                'c.profileImage AS profileImage'
                            )
                                ->join('riderTripCustomer as rtc', 'rtc.riderId', '=', 'rider.id')
                                ->join('ride as r2', 'rider.rideId', '=', 'r2.id')
                                ->join('trip as t', 'r2.tripReference', '=', 't.tripReference')
                                ->leftJoin('tripCustomer as tC', 'rtc.tripCustomerId', '=', 'tC.id')
                                ->leftJoin('user as u', 'rtc.userId', '=', 'u.idUser')
                                ->join('customer as c', 'u.idUser', '=', 'c.userId')
                                ->join('tripPaymentForm', 'rider.tripPaymentFormId', '=', 'tripPaymentForm.idTripPaymentForm');
                        }
                    ]);
                },
            ])
            ->first();
    }

    public function findByCentral($centralId, $request_query = null)
    {
        $driverId = $request_query['driverId'] ?? null;
        $status = $request_query['status'] ?? null;
        $date = $request_query['date'] ?? null;

        return $this->getModel()
            ::where('centralId', '=', $centralId)
            ->when($driverId, function (Builder $query, $driverId) {
                $query
                    ->where('driverId', '=', $driverId);
            })
            ->when($status, function (Builder $query, $status) {
                $query
                    ->where('status', '=', $status);
            })
            ->when($date, function (Builder $query, $date) {
                $query
                    ->whereBetween('date', $date);
            })
            ->join('tripPaymentForm', 'tripPaymentFormId', '=', 'idTripPaymentForm')
            ->join('tripType', 'tripTypeId', '=', 'idTripType')
            ->join('tripAudit', 'tripAuditId', '=', 'id')
            ->join('city', 'cityId', '=', 'city.id')
            ->select([
                'idTrip',
                'tripReference',
                'date',
                'endDate',
                'price',
                'driverId',
                'userId',
                'tripTypeId',
                'status',
                'canceledBy',
                'tripPaymentForm.name AS tripPaymentForm',
                'tripType.type AS tripType',
                'situation',
                'originId',
                'destinationId',
                'centralCustomerId',
                'cityId',
                'nome AS cityName'
            ])
            ->with([
                'driver' => function (BelongsTo $query) {
                    $query
                        ->join('user', 'driver.userId', '=', 'idUser')
                        ->select([
                            'idDriver',
                            'user.name AS driverName',
                            'user.phone AS driverPhone',
                            'driver.profileImage AS driverPhoto',
                        ]);
                },
                'origin' => function (BelongsTo $query) {
                    $query
                        ->select([
                            'idOrigin',
                            'latitude',
                            'longitude',
                            'address',
                        ]);
                },
                'destination' => function (BelongsTo $query) {
                    $query
                        ->select([
                            'idDestination',
                            'latitude',
                            'longitude',
                            'address',
                        ]);
                },
                'centralCustomer' => function (BelongsTo $query) {
                    $query
                        ->select([
                            'id',
                            'name',
                            'phone',
                            'document',
                        ]);
                },
                'tripWayPoints' => function (HasMany $query) {
                    $query
                        ->select([
                            'tripReference',
                            'latitude',
                            'longitude',
                            'address',
                        ]);
                },
            ])
            ->orderByDesc('date')
            ->paginate(PaginationConst::LIMIT_PER_PAGE);
    }

    public function findActivesByDriver($driverId)
    {
        return $this->getModel()
            ::select([
                'idTrip',
                'tripReference',
                'date',
                'endDate',
                'price',
                'driverId',
                'userId',
                'tripTypeId',
                'trip.status',
                'canceledBy',
                'tripPaymentForm.name AS tripPaymentForm',
                'tripType.type AS tripType',
                'situation',
                'originId',
                'destinationId',
                'centralCustomerId',
                'trip.cityId',
                'nome AS cityName',
                'nickname AS customerName',
            ])
            ->where('driverId', $driverId)
            ->whereIn('trip.status', TripConst::ACTIVE_STATUSES)
            ->join('tripPaymentForm', 'tripPaymentFormId', '=', 'idTripPaymentForm')
            ->join('tripType', 'tripTypeId', '=', 'idTripType')
            ->join('user', 'trip.userId', '=', 'idUser')
            ->join('city', 'trip.cityId', '=', 'city.id')
            ->join('tripAudit', 'tripAuditId', '=', 'tripAudit.id')
            ->with([
                'origin' => function (BelongsTo $query) {
                    $query
                        ->select([
                            'idOrigin',
                            'address',
                            'neighborhood',
                            'latitude',
                            'longitude',
                        ]);
                },
                'destination' => function (BelongsTo $query) {
                    $query
                        ->select([
                            'idDestination',
                            'address',
                            'neighborhood',
                            'latitude',
                            'longitude',
                        ]);
                },
            ])
            ->orderBy('idTrip')
            ->get();
    }

    public function updateStatusTrip($tripReference, $status)
    {
        return $this->getModel()
            ::where('tripReference', $tripReference)
            ->update(['status' => $status]);
    }

    public function findCurrentByDriver(int $driverId)
    {
        return $this->getModel()
            ::where('driverId', $driverId)
            ->whereNotIn('status', [
                TripConst::CANCELED,
                TripConst::FINISHED,
                TripConst::SCHEDULED,
                TripConst::NOT_ANSWERED,
                TripConst::BACK_OFF,
            ])
            ->orderBy('idTrip')
            ->get();
    }

    public function findInAnalysis(User $authUser, array $request = [], int $cityId = null)
    {
        $cityIds = DB::table('roleCity')
            ->where('roleCity.roleId', $authUser->roleId)
            ->pluck('cityId');

        $driverId = $request['driverId'] ?? null;

        return $this->getModel()::query()
            ->join('balanceFlow', 'trip.tripReference', 'balanceFlow.tripReference')
            ->join('balanceFlowType', 'balanceFlowType.idBalanceFlowType', 'balanceFlow.balanceFlowTypeId')
            ->join('tripPaymentForm', 'trip.tripPaymentFormId', 'tripPaymentForm.idTripPaymentForm')
            ->join('user as customerUser', 'trip.userId', 'customerUser.idUser')
            ->leftJoin('customer', 'customerUser.idUser', 'customer.userId')
            ->leftJoin('establishment', 'establishment.idEstablishment', 'trip.establishmentId')
            ->leftJoin('origin', 'origin.idOrigin', 'trip.originId')
            ->leftJoin('station', 'station.idStation', 'trip.stationId')
            ->leftJoin('destination', 'destination.idDestination', 'trip.destinationId')
            ->leftJoin('driver', 'driver.idDriver', 'trip.driverId')
            ->leftJoin('user as driverUser', 'driverUser.idUser', 'driver.userId')
            ->leftJoin('tripRating', function ($join) {
                $join->on('tripRating.tripReference', '=', 'trip.tripReference')
                    ->on('tripRating.ratedUser', '=', 'driver.userId');
            })
            ->whereIn('balanceFlowType.flowId', [FlowTypeConst::INPUT_BLOCKED, FlowTypeConst::OUT_BLOCKED])
            ->when(!empty($cityIds), function ($query) use ($cityIds) {
                $query->whereIn('trip.cityId', $cityIds);
            })
            ->when(isset($driverId), function ($query) use ($driverId) {
                $query->where('trip.driverId', $driverId);
            })
            ->when(!$authUser->role->support && isset($cityId), function ($query) use ($cityId) {
                $query->where('trip.cityId', $cityId);
            })
            ->groupBy('balanceFlow.tripReference')
            ->orderByDesc('balanceFlow.date')
            ->select(
                'balanceFlow.idBalanceFlow',
                'trip.tripReference',
                'trip.price',
                'trip.tripPaymentFormId',
                'tripPaymentForm.name AS paymentForm',
                'balanceFlow.value',
                'balanceFlowType.flow',
                'trip.driverId',
                'trip.userId',
                'trip.status',
                'trip.canceledBy',
                DB::raw('CASE WHEN trip.originId IS NOT NULL THEN origin.address ELSE establishment.fantasyName END AS originAddress'),
                DB::raw('CASE WHEN trip.stationId IS NOT NULL THEN station.name ELSE destination.address END AS destinationAddress'),
                'driverUser.name AS driverName',
                'driverUser.phone AS driverPhone',
                'driver.profileImage AS driverPhoto',
                'customerUser.name AS customerName',
                'customerUser.phone AS customerPhone',
                'customer.profileImage AS customerPhoto',
                'balanceFlow.date',
                'trip.tripCallTypeId',
                'tripRating.comment AS customerComment'
            )
            ->paginate();
    }

    public function updateTripAudit(int $tripAuditId, array $tripReferences)
    {
        return Trip::query()->whereIn('tripReference', $tripReferences)
            ->update(['tripAuditId' => $tripAuditId]);
    }

    public function findAllScheduled(array $request = [], int $userId = null, int $cityId = null)
    {
        return $this->getModel()::select(
            'trip.idTrip',
            'trip.tripReference',
            'trip.date',
            'trip.price',
            'trip.driverId',
            'trip.userId',
            'trip.customerId',
            'trip.tripCallTypeId',
            'tct.name AS callType',
            DB::raw('CASE
                   WHEN trip.tripCustomerId IS NOT NULL THEN cp.name
                   WHEN trip.customerId IS NOT NULL THEN ct.name
                   ELSE uc.name
            END AS customerName'),
            'uc.phone AS customerPhone',
            'trip.status',
            'trip.canceledBy',
            'tpf.name AS paymentForm',
            'ta.situation',
            'o.address AS originAddress',
            'd.address AS destinationAddress',
            'o.latitude AS originLatitude',
            'o.longitude AS originLongitude',
            'd.latitude AS destinationLatitude',
            'd.longitude AS destinationLongitude',
            'tripType.type as tripType',
            'ts.schedule as scheduleDate'
        )
            ->join('tripAudit as ta', 'trip.tripAuditId', 'ta.id')
            ->join('tripCallType as tct', 'trip.tripCallTypeId', 'tct.id')
            ->join('tripPaymentForm as tpf', 'trip.tripPaymentFormId', 'tpf.idTripPaymentForm')
            ->join('user as uc', 'trip.userId', 'uc.idUser')
            ->leftJoin('tripCustomer as cp', 'trip.tripCustomerId', 'cp.id')
            ->leftJoin('customer as ct', 'trip.customerId', 'ct.idCustomer')
            ->leftJoin('origin as o', 'trip.originId', '=', 'o.idOrigin')
            ->leftJoin('destination as d', 'trip.destinationId', '=', 'd.idDestination')
            ->leftJoin('tripScheduled as ts', 'trip.tripReference', '=', 'ts.tripReference')
            ->join('tripType', 'trip.tripTypeId', 'tripType.idTripType')
            ->when(isset($cityId), function (Builder $query) use ($cityId) {
                $query->where('trip.cityId', $cityId);
            })
            ->when(isset($request['status']), function (Builder $query) use ($request) {
                $query->where('trip.status', $request['status']);
            })
            ->with([
                'tripWayPoints' => function (HasMany $query){
                    $query
                        ->select([
                            'tripReference',
                            'latitude',
                            'longitude',
                            'address',
                            'confirmed',
                            'created_at'
                        ]);
                },
            ])
            ->orderByDesc('trip.date')
            ->paginate($request['per_page'] ?? 10);
    }

    public function getTrips(
        $startDate,
        $endDate,
        $driverId,
        $userId,
        $cityId,
        $isToday,
        $status = null
    ) {

        if($isToday){
            $currentDate = date("Y-m-d");

            return $this->getModel()::select(
                "driverId",
                "userId",
                "status",
                "price",
                "canceledBy"
            )
                ->whereDate('date', $currentDate)
                ->when($driverId !== null, function ($query) use ($driverId) {
                    return $query->where("driverId", $driverId);
                })
                ->when(isset($cityId), function (Builder $query) use ($cityId) {
                    $query->where('trip.cityId', $cityId);
                })
                ->when($userId !== null, function ($query) use ($userId) {
                    return $query->where("userId", $userId);
                })
                ->when($status !== null, function ($query) use ($status) {
                    return $query->where("status", $status);
                })
                ->get();
        }else{
            return $this->getModel()::select(
                "driverId",
                "userId",
                "status",
                "price",
                "canceledBy"
            )
                ->whereBetween('date', [
                    Carbon::parse($startDate)->startOfDay(),
                    Carbon::parse($endDate)->endOfDay()
                ])
                ->when($driverId !== null, function ($query) use ($driverId) {
                    return $query->where("driverId", $driverId);
                })
                ->when(isset($cityId), function (Builder $query) use ($cityId) {
                    $query->where('trip.cityId', $cityId);
                })
                ->when($userId !== null, function ($query) use ($userId) {
                    return $query->where("userId", $userId);
                })
                ->when($status !== null, function ($query) use ($status) {
                    return $query->where("status", $status);
                })
                ->get();
        }
    }

    public function findTripsByCity(int $cityId)
    {
        return $this->getModel()
            ::select(
                'status',
                'driverId',
                'userId',
                'canceledBy',
                'date',
                'price',
                'tripPaymentForm.name',
                'tripPaymentForm.paymentFormTypeId'
            )
            ->join(
                'tripPaymentForm',
            'trip.tripPaymentFormId', '=', 'tripPaymentForm.idTripPaymentForm'
            )
            ->where('cityId', $cityId)
            ->get();
    }


    public function findTripsByCityToday(int $cityId)
    {
        return $this->getModel()
            ::select(
                'status',
                'driverId',
                'userId',
                'canceledBy',
                'date',
                'price',
                'tripPaymentForm.name',
                'tripPaymentForm.paymentFormTypeId'
            )
            ->join(
                'tripPaymentForm',
            'trip.tripPaymentFormId', '=', 'tripPaymentForm.idTripPaymentForm'
            )
            ->where('cityId', $cityId)
            ->whereDate('date', '=', date('Y-m-d'))
            ->get();
    }

    public function findAllTrip()
    {
        return $this->getModel()
            ::select(
                'status',
                'driverId',
                'userId',
                'canceledBy',
                'date',
                'price',
                'tripPaymentForm.name',
                'tripPaymentForm.paymentFormTypeId'
            )
            ->join(
                'tripPaymentForm',
            'trip.tripPaymentFormId', '=', 'tripPaymentForm.idTripPaymentForm'
            )
            ->get();
    }
    public function findCurrentByDriverId($driverId, $plate = false)
    {
        if($plate){
            $car = DB::table('car')
                ->whereRaw('LOWER(REPLACE(plate, "-", "")) LIKE LOWER(?)', ['%' . str_replace('-', '', $plate) . '%'])
                ->first();
            if(!$car) return [];

            $driverId = $car->driverId;
        }

        $trip = $this->getModel()
            ::where('driverId', $driverId)
            ->whereIn('status', ['in_progress', 'boarding'])
            ->with(['driver.user', 'driver.lastCar', 'user', 'user.customer', 'origin', 'destination'])
            ->first();

        if($trip === null) return [];

        return [
            'tripReference' => $trip->tripReference,
            'status' => $trip->status,
            'price' => $trip->price,
            'driver' => [
                'idUser' => $trip->driver->user->idUser,
                'driverId' => $trip->driverId,
                'name' => $trip->driver->user->name,
                'nickname' => $trip->driver->user->nickname,
                'document' => $trip->driver->user->document,
                'phone' => $trip->driver->user->phone,
                'email' => $trip->driver->user->email,
                'dateOfBirth' => $trip->driver->user->dateOfBirth,
                'profilePhoto' => $trip->driver->profileImage,
                'gender' => $trip->driver->user->gender,
            ],
            'vehicle' => [
                'idCar' => $trip->driver->lastCar->idCar,
                'brand' => $trip->driver->lastCar->brand,
                'model' => $trip->driver->lastCar->model,
                'year' => $trip->driver->lastCar->year,
                'plate' => $trip->driver->lastCar->plate,
                'color' => $trip->driver->lastCar->color,
                'renavam' => $trip->driver->lastCar->renavam,
            ],
            'customer' => [
                'idUser' => $trip->user->idUser,
                'name' => $trip->user->name,
                'nickname' => $trip->user->nickname,
                'document' => $trip->user->document,
                'phone' => $trip->user->phone,
                'email' => $trip->user->email,
                'dateOfBirth' => $trip->user->dateOfBirth,
                'profilePhoto' => $trip->user->customer->profileImage,
                'gender' => $trip->user->gender,
            ],
            'origin' => [
                'latitude' => $trip->origin->latitude,
                'longitude' => $trip->origin->longitude,
                'address' => $trip->origin->address,
            ],
            'destination' => [
                'latitude' => $trip->destination->latitude,
                'longitude' => $trip->destination->longitude,
                'address' => $trip->destination->address,
            ],
        ];
    }
}
