<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 06/11/2019
 * Time: 14:20
 */

namespace App\Repositories\Report;


use App\Constants\Balance\BalanceFlowTypeConst;
use App\Constants\Trip\TripCallTypeConst;
use App\Models\Role\Role;
use App\Models\User\User;
use Carbon\Carbon;
use App\Models\Trip\Trip;
use App\Constants\StatusConst;
use App\Constants\Trip\TripConst;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use App\Constants\Trip\TripHistoryConst;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\JoinClause;
use App\Constants\Trip\PaymentFormTypeConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\ReadOnly\Trip\TripRO;
use Illuminate\Database\Query\Builder as BuilderQuery;

class TripReportRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(TripRO::class);
    }

    public function findAll(array $request = [], User $authUser = null, $centralFee = false)
    {
        return $this->getModel()
            ::join('tripAudit', 'trip.tripAuditId', '=', 'tripAudit.id')
            ->join('tripPaymentForm', 'trip.tripPaymentFormId', '=', 'tripPaymentForm.idTripPaymentForm')
            ->join('tripType', 'trip.tripTypeId', '=', 'tripType.idTripType')
            ->join('tripCallType as tc', 'trip.tripCallTypeId', '=', 'tc.id')
            ->leftJoin('rewardCampaignTrip as rCT', 'trip.tripReference', '=', 'rCT.tripReference')
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
            ->leftJoin('tripCancellationCustomerFee as tCCF', 'trip.tripReference', '=', 'utd.idUserType')
            ->leftJoin('tripDiscountCoupon as tDC', 'trip.tripReference', '=', 'tDC.tripReference')
            ->leftJoin('userDiscountCoupon as uDC', 'tDC.userDiscountCouponId', '=', 'uDC.id')
            ->leftJoin('discountCoupon as dC2', 'uDC.discountCouponId', '=', 'dC2.id')
            ->leftJoin('balanceFlow as bfpf', function (JoinClause $join) {
                $join->where('bfpf.balanceFlowTypeId', BalanceFlowTypeConst::BALANCE_OUT_RATE_PAYMENT_FORM)
                    ->on('bfpf.tripReference', 'trip.tripReference');
            })
            ->leftJoin('balanceFlow as bfof', function (JoinClause $join) {
                $join->where('bfof.balanceFlowTypeId', BalanceFlowTypeConst::COMMITTEES_EXIT)
                    ->on('bfof.tripReference', 'trip.tripReference');
            })
            ->leftJoin('recalculatedTrip', 'trip.tripReference', 'recalculatedTrip.tripReference')
            ->when(isset($authUser->role->support) && !$authUser->role->support, function (Builder $query) use ($authUser) {
                $query->whereIn('trip.cityId', function (\Illuminate\Database\Query\Builder $query) use ($authUser) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleCity.roleId', $authUser->roleId);
                });
            })
            ->select([
                'trip.idTrip',
                'trip.tripReference',
                'trip.date',
                'trip.endDate',
                'trip.price',
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
                'trip.cityId',
                'trip.description',
                'nome AS cityName',
                'ud.name as driverName',
                'ud.email as driverEmail',
                'driver.profileImage as driverPhoto',
                'lad.userTypeId as driverTypeId',
                'utd.name as driverType',
                'ud.phone as driverPhone',
                DB::raw('ifnull(`recalculatedTrip`.`newDistance`, `trip`.`distance`) as `distance`'),
                DB::raw('ifnull(`recalculatedTrip`.`newTripTime`, `trip`.`estimatedTripTime`) as `estimatedTripTime`'),
                'trip.tripTypeId as tripTypeId',
                'trip.tripCallTypeId as tripCallTypeId',
                'trip.customerId as customerId',
                'trip.zoneId as zoneId',
                'trip.tripPaymentFormId as tripPaymentFormId',
                'uc.platform as platform',
                'uc.name as createdByName',
                'uc.email as createdByEmail',
                'tCCF.feeValue as cancellationFee',
                'cR.name as cancellationReasons',
                'dC2.code as discountCoupon',
                DB::raw('round((ifnull(rT.value, 0) + ifnull(rCT.value, 0)), 2) as driverReward'),
                DB::raw('(case
                    when (trip.centralCustomerId is not null) then convert(centralCustomer.name using utf8mb4)
                    when (trip.tripCustomerId is not null) then convert(cp.name using utf8mb4)
                    when (trip.customerId is not null) then convert(ct.name using utf8mb4)
                    else uc.name end) as customerName'),
                DB::raw('(case
                    when (trip.centralCustomerId is not null) then convert(centralCustomerUser.email using utf8mb4)
                    when (trip.tripCustomerId is not null) then convert(cp.email using utf8mb4)
                    when (trip.customerId is not null) then \'\'
                    else uc.email end) as customerEmail'),
                DB::raw('coalesce(centralCustomerProfile.profileImage, c.profileImage) as customerPhoto'),
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
                round((trip.price * (dC.value / 100)), 2)) as appValue'),
                DB::raw('round(bfpf.value, 2) as paymentFormFee'),
                DB::raw('round(bfof.value, 2) - if((dC.valueType = \'$\'), round(dC.value, 2),
                                 round((trip.price * (dC.value / 100)), 2)) as otherFee'),
                DB::raw('if((dC.valueType = \'$\'),
          round((trip.price - ifnull(round(bfof.value, 2), round(dC.value, 2)) - ifnull(round(bfpf.value, 2), 0)), 2),
          round((trip.price - ifnull(round(bfof.value, 2), round(trip.price * (dC.value / 100), 2)) -
                 ifnull(round(bfpf.value, 2), 0)),
                2))                                                         as driverValue'),
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
            ->when($centralFee, function (Builder $query) {
                $query->join('tripCentralFee as tCF', 'tCF.tripId', 'trip.idTrip')
                    ->join('centralFee as cF', 'cF.id', 'tCF.centralFeeId')
                    ->addSelect('cF.returnFee');
            })
            ->selectSub(function (\Illuminate\Database\Query\Builder $query) {
                $query->selectRaw("group_concat(concat(doc.label, '- ', docUser.text))")
                    ->from('docUserType')
                    ->join('doc', 'docUserType.docId', 'doc.id')
                    ->join('docUser', 'doc.id', 'docUser.docId')
                    ->whereColumn('docUser.userId', 'trip.userId')
                    ->where('docUserType.userTypeId', 5)
                    ->where('doc.statusId', StatusConst::ACTIVE)
                    ->where('docUserType.statusId', StatusConst::ACTIVE)
                    ->groupBy('docUser.userId');
            }, 'documents')
            ->groupBy('trip.tripReference')
            ->when(isset($request['dateStart']), function (Builder $query) use ($request) {
                $query->where('trip.date', '>=', Carbon::parse($request['dateStart'])->startOfDay());
            })
            ->when(isset($request['dateEnd']), function (Builder $query) use ($request) {
                $query->where('trip.date', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
            })
            ->when(isset($request['tripPaymentFormId']), function (Builder $query) use ($request) {
                $query->where('trip.tripPaymentFormId', $request['tripPaymentFormId']);
            })
            ->when(isset($request['tripCallTypeId']), function (Builder $query) use ($request) {
                $query->where('trip.tripCallTypeId', $request['tripCallTypeId']);
            })
            ->when(isset($request['driverId']), function (Builder $query) use ($request) {
                $query->where('trip.driverId', $request['driverId']);
            })
            ->when(isset($request['userId']), function (Builder $query) use ($request) {
                $query->where('trip.userId', $request['userId']);
            })
            ->when(isset($request['cityId']), function (Builder $query) use ($request) {
                $query->where('trip.cityId', $request['cityId']);
            })
            ->when(isset($request['status']), function (Builder $query) use ($request) {
                $query->where('trip.status', $request['status']);
            })
            ->when(isset($request['tripTypeId']), function (Builder $query) use ($request) {
                $query->where('trip.tripTypeId', $request['tripTypeId']);
            })
            ->when(isset($request['centralId']), function (Builder $query) use ($request) {
                $query->where('trip.centralId', $request['centralId']);
            })
            ->orderBy('trip.idTrip')
            ->get();
    }

    public function tripValuesByDriver(array $queryRequest = [])
    {
        DB::setDefaultConnection('mysql_ro');

        return $this->getModel()
            ::where('trip.status', TripConst::FINISHED)
            ->selectRaw("
                DISTINCT trip.driverId,
                user.name,
                ROUND(SUM(trip.price), 2)                                                                        AS totalTripValue,
                COUNT(trip.idTrip)                                                                               AS totalTripQuantity,
                SUM(ROUND(CASE
                              WHEN trip.driverCommissionId IS NULL THEN
                                  0
                              WHEN driverCommission.valueType = '$' THEN
                                  driverCommission.value
                              ELSE
                                  trip.price * (driverCommission.value / 100)
                              END,
                          2))                                                                                    AS appFee,
                SUM(ifnull(round(bfpf.value, 2), 0))                                                             as paymentFormFee,
                SUM(ifnull(round(bfof.value - round(if(driverCommission.valueType = '$', driverCommission.value,
                                                       trip.price * (driverCommission.value / 100)), 2), 2),
                           0))                                                                                   as otherFee,
                tripTax.taxes,
                ifnull(tripTax.totalTaxes, 0) as totalTaxes,
                SUM(if((driverCommission.valueType = '$'),
                       round((trip.price - ifnull(round(bfof.value, 2) + ifnull(round(bfpf.value, 2), 0),
                                                  driverCommission.value + ifnull(round(bfpf.value, 2), 0))), 2),
                       round((trip.price - ifnull(round(bfof.value, 2) + ifnull(round(bfpf.value, 2), 0),
                                                  (trip.price * (driverCommission.value / 100)) +
                                                  ifnull(round(bfpf.value, 2), 0))), 2))) -
                ifnull(tripTax.totalTaxes, 0)                                                                               as driverValue,
                ROUND(SUM(IF(paymentFormType.id IN (3, 8), trip.price, 0)), 2)                                   AS cardPayment,
                ROUND(SUM(IF(paymentFormType.id IN (1, 5), trip.price, 0)), 2)                                   AS voucherPayment,
                ROUND(SUM(IF(paymentFormType.id = 2, trip.price, 0)), 2)                                         AS vehiclePayment,
                ROUND(SUM(IF(paymentFormType.id = 4, trip.price, 0)), 2)                                         AS vehicleCardPayment,
                ROUND(SUM(IF(paymentFormType.id = 7, trip.price, 0)), 2)                                         AS taximeterPayment
            ")
            ->join('driver', 'trip.driverId', '=', 'driver.idDriver')
            ->join('user', 'user.idUser', '=', 'driver.userId')
            ->join('driverCommission', 'trip.driverCommissionId', '=', 'driverCommission.idDriverCommission')
            ->join('tripPaymentForm', 'trip.tripPaymentFormId', '=', 'tripPaymentForm.idTripPaymentForm')
            ->join('paymentFormType', 'tripPaymentForm.paymentFormTypeId', '=', 'paymentFormType.id')
            ->leftJoinSub(DB::table('balanceFlow')
                ->where('balanceFlowTypeId', BalanceFlowTypeConst::BALANCE_OUT_RATE_PAYMENT_FORM)
                ->groupBy('tripReference'),
                'bfpf', 'bfpf.tripReference', 'trip.tripReference')
            ->leftJoinSub(
                DB::table('balanceFlow')
                    ->where('balanceFlowTypeId', BalanceFlowTypeConst::COMMITTEES_EXIT)
                    ->groupBy('tripReference'),
                'bfof', 'bfof.tripReference', 'trip.tripReference')
            ->leftJoinSub(
                DB::table('driver')
                    ->select(
                        DB::raw("group_concat(tax.name, ': ', bf.value) as taxes"),
                        DB::raw("sum(bf.value) as totalTaxes"),
                        'driverId'
                    )
                    ->joinSub(DB::table('balanceFlow')
                        ->select(
                            'taxId',
                            DB::raw("sum(round(balanceFlow.value, 2)) as value"),
                            'idDriver as driverId'
                        )
                        ->join('driver', 'balanceFlow.balanceId', 'driver.balanceId')
                        ->join('tax', 'balanceFlow.taxId', 'tax.id')
                        ->join('trip', 'balanceFlow.tripReference', 'trip.tripReference')
                        ->where('balanceFlow.balanceFlowTypeId', BalanceFlowTypeConst::EXIT_DYNAMIC_TAX)
                        ->where('trip.status', TripConst::FINISHED)
                        ->when(isset($queryRequest['dateStart']),
                            function (\Illuminate\Database\Query\Builder $query) use ($queryRequest) {
                                $query->where('trip.date', '>=', Carbon::parse($queryRequest['dateStart'])->startOfDay());
                            },
                            function (\Illuminate\Database\Query\Builder $query) use ($queryRequest) {
                                $query->where('trip.date', '>=', today()->startOfDay());
                            })
                        ->when(isset($queryRequest['dateEnd']),
                            function (\Illuminate\Database\Query\Builder $query) use ($queryRequest) {
                                $query->where('trip.date', '<=', Carbon::parse($queryRequest['dateEnd'])->endOfDay());
                            },
                            function (\Illuminate\Database\Query\Builder $query) use ($queryRequest) {
                                $query->where('trip.date', '<=', today()->endOfDay());
                            })
                        ->when(isset($queryRequest['cityId']), function (\Illuminate\Database\Query\Builder $query) use ($queryRequest) {
                            $query->where('trip.cityId', $queryRequest['cityId']);
                        })
                        ->when(isset($queryRequest['driverId']), function (\Illuminate\Database\Query\Builder $query) use ($queryRequest) {
                            $query->where('trip.driverId', $queryRequest['driverId']);
                        })
                        ->groupBy('driverId', 'taxId')
                        , 'bf', 'driver.idDriver', 'bf.driverId')
                    ->join('tax', 'bf.taxId', 'tax.id')
                    ->groupBy('driverId')
                , 'tripTax', 'tripTax.driverId', 'trip.driverId'
            )
            ->when(isset($queryRequest['dateStart']),
                function (Builder $query) use ($queryRequest) {
                    $query
                        ->where(
                            'trip.date', '>=',
                            Carbon::parse($queryRequest['dateStart'])->startOfDay());
                },
                function (Builder $query) use ($queryRequest) {
                    $query
                        ->where('trip.date', '>=', today()->startOfDay());
                })
            ->when(isset($queryRequest['dateEnd']),
                function (Builder $query) use ($queryRequest) {
                    $query
                        ->where(
                            'trip.date', '<=',
                            Carbon::parse($queryRequest['dateEnd'])->endOfDay());
                },
                function (Builder $query) use ($queryRequest) {
                    $query
                        ->where('trip.date', '<=', today()->endOfDay());
                })
            ->when(isset($queryRequest['cityId']), function (Builder $query) use ($queryRequest) {
                $query
                    ->where('trip.cityId', $queryRequest['cityId']);
            })
            ->when(isset($queryRequest['driverId']), function (Builder $query) use ($queryRequest) {
                $query
                    ->where('trip.driverId', $queryRequest['driverId']);
            })
            ->groupBy('trip.driverId')
            ->when(isset($queryRequest['page']),
                function (Builder $query) use ($queryRequest) {
                    return $query
                        ->paginate();
                }, function (Builder $query) use ($queryRequest) {
                    return $query
                        ->get();
                });
    }

    public function counterTripHistoryByPeriod(Carbon $dateStart, Carbon $dateEnd, array $request, Role $authRole)
    {
        return $this->getModel()
            ::when(isset($request['driverId']), function (Builder $query) use ($request) {
                $query->where('driverId', $request['driverId']);
            })
            ->selectSub(function (BuilderQuery $query) use ($dateStart, $dateEnd, $request, $authRole) {
                $query
                    ->from("trip")
                    ->whereBetween(
                        'date', [
                        $dateStart->startOfDay(),
                        $dateEnd->endOfDay()
                    ])
                    ->when(isset($request['driverId']), function (BuilderQuery $query) use ($request) {
                        $query
                            ->where('driverId', $request['driverId']);
                    })
                    ->when(!$authRole->support, function (\Illuminate\Database\Query\Builder $query) use ($authRole) {
                        $query->whereIn('trip.cityId', function (\Illuminate\Database\Query\Builder $query) use ($authRole) {
                            $query->select('cityId')
                                ->from('roleCity')
                                ->where('roleId', $authRole->id);
                        });
                    })
                    ->whereNotNull('driverId')
                    ->selectRaw("COUNT('idTrip')");
            }, 'allowed')
            ->selectSub(function (BuilderQuery $query) use ($dateStart, $dateEnd, $request, $authRole) {
                $query
                    ->from('driverCalled')
                    ->join('trip', 'trip.tripReference', 'driverCalled.tripReference')
                    ->where('driverCalled.status', 'refused')
                    ->when(isset($request['driverId']), function (BuilderQuery $query) use ($request) {
                        $query
                            ->where('driverId', $request['driverId']);
                    })
                    ->when(!$authRole->support, function (\Illuminate\Database\Query\Builder $query) use ($authRole) {
                        $query->whereIn('cityId', function (\Illuminate\Database\Query\Builder $query) use ($authRole) {
                            $query->select('cityId')
                                ->from('roleCity')
                                ->where('roleId', $authRole->id);
                        });
                    })
                    ->whereBetween(
                        'created_at', [
                        $dateStart->startOfDay(),
                        $dateEnd->endOfDay()
                    ])
                    ->distinct()
                    ->selectRaw("IFNULL(COUNT(`driverCalled`.`tripReference`), 0)");
            }, 'rejected')
            ->selectSub(function (BuilderQuery $query) use ($dateStart, $dateEnd, $request, $authRole) {
                $query
                    ->from("trip")
                    ->whereBetween(
                        'date', [
                        $dateStart->startOfDay(),
                        $dateEnd->endOfDay()
                    ])
                    ->when(isset($request['driverId']), function (BuilderQuery $query) use ($request) {
                        $query
                            ->where('driverId', $request['driverId']);
                    })
                    ->when(!$authRole->support, function (\Illuminate\Database\Query\Builder $query) use ($authRole) {
                        $query->whereIn('cityId', function (\Illuminate\Database\Query\Builder $query) use ($authRole) {
                            $query->select('cityId')
                                ->from('roleCity')
                                ->where('roleId', $authRole->id);
                        });
                    })
                    ->where('status', TripConst::CANCELED)
                    ->where('canceledBy', TripConst::CANCELED_BY_DRIVER)
                    ->whereNotNull('driverId')
                    ->selectRaw("COUNT('idTrip')");
            }, 'canceledByDriver')
            ->selectSub(function (BuilderQuery $query) use ($dateStart, $dateEnd, $request, $authRole) {
                $query
                    ->from("trip")
                    ->whereBetween(
                        'date', [
                        $dateStart->startOfDay(),
                        $dateEnd->endOfDay()
                    ])
                    ->when(isset($request['driverId']), function (BuilderQuery $query) use ($request) {
                        $query
                            ->where('driverId', $request['driverId']);
                    })
                    ->when(!$authRole->support, function (\Illuminate\Database\Query\Builder $query) use ($authRole) {
                        $query->whereIn('cityId', function (\Illuminate\Database\Query\Builder $query) use ($authRole) {
                            $query->select('cityId')
                                ->from('roleCity')
                                ->where('roleId', $authRole->id);
                        });
                    })
                    ->where('status', TripConst::CANCELED)
                    ->where('canceledBy', TripConst::CANCELED_BY_CUSTOMER)
                    ->whereNotNull('driverId')
                    ->selectRaw("COUNT('idTrip')");
            }, 'canceledByCustomer')
            ->selectSub(function (BuilderQuery $query) use ($dateStart, $dateEnd, $request, $authRole) {
                $query
                    ->from("trip")
                    ->whereBetween(
                        'date', [
                        $dateStart->startOfDay(),
                        $dateEnd->endOfDay()
                    ])
                    ->when(isset($request['driverId']), function (BuilderQuery $query) use ($request) {
                        $query
                            ->where('driverId', $request['driverId']);
                    })
                    ->when(!$authRole->support, function (\Illuminate\Database\Query\Builder $query) use ($authRole) {
                        $query->whereIn('cityId', function (\Illuminate\Database\Query\Builder $query) use ($authRole) {
                            $query->select('cityId')
                                ->from('roleCity')
                                ->where('roleId', $authRole->id);
                        });
                    })
                    ->where('status', TripConst::CANCELED)
                    ->whereNotNull('driverId')
                    ->selectRaw("COUNT('idTrip')");
            }, 'canceled')
            ->whereBetween('date', [
                $dateStart->startOfDay(),
                $dateEnd->endOfDay(),
            ])
            ->when(!$authRole->support, function (Builder $query) use ($authRole) {
                $query->whereIn('trip.cityId', function (\Illuminate\Database\Query\Builder $query) use ($authRole) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleId', $authRole->id);
                });
            })
            ->selectRaw("COUNT(tripReference) AS total")
            ->first();
    }

    /**
     * @param array $request
     * @return array|\Illuminate\Database\Concerns\BuildsQueries[]|Builder[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model[]
     */
    public function corporateTravelList(array $request = [], bool $isSupport = false, int $cityId = null)
    {
        return $this->getModel()
            ::join('user', 'trip.userId', '=', 'user.idUser')
            ->join('companyWorker', 'user.idUser', '=', 'companyWorker.userId')
            ->join('company', 'companyWorker.companyId', '=', 'company.id')
            ->join('tripPaymentForm', 'trip.tripPaymentFormId', '=', 'tripPaymentForm.idTripPaymentForm')
            ->join('paymentFormType', 'tripPaymentForm.paymentFormTypeId', '=', 'paymentFormType.id')
            ->where('paymentFormType.id', PaymentFormTypeConst::VOUCHER_ADMINISTRATIVE)
            ->select(
                'user.name AS customerName',
                'user.document AS document',
                'company.fantasyName AS fantasyName',
                'trip.status AS status',
                'trip.price AS price',
                'trip.date',
                'trip.endDate'
            )
            ->when(isset($request['dateStart']),
                function (Builder $query) use ($request) {
                    $query->where('date', '>=', Carbon::parse($request['dateStart'])->startOfDay());
                })
            ->when(isset($request['dateEnd']),
                function (Builder $query) use ($request) {
                    $query->where('date', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
                })
            ->when(isset($request['fantasyNameId']), function (Builder $query) use ($request) {
                $query->where('company.id', '=', $request['fantasyNameId']);
            })
            ->when(isset($request['status']), function (Builder $query) use ($request) {
                $query->where('status', $request['status']);
            })
            ->when(!$isSupport && isset($cityId), function (Builder $query) use ($cityId) {
                $query->where('trip.cityId', $cityId);
            })
            ->orderByDesc('user.created_at')
            ->get();
    }

    public function getAllSharedRoutes(array $request, Role $roleAuthUser)
    {
        return $this->getModel()::select(
            'driverUser.name as driverName',
            'customerUser.name as customerName',
            'trip.tripReference',
            'trip.date',
            'trip.endDate',
            'rider.value',
            'trip.status',
            'tripPaymentForm.name as tripPaymentForm',
            'origin.address as origin',
            'destination.address as destination'
        )
            ->join('ride', 'trip.tripReference', 'ride.tripReference')
            ->join('rider', function (JoinClause $join) {
                $join->on('ride.id', 'rider.rideId')
                    ->where('rider.statusId', StatusConst::ACTIVE);
            })
            ->join('user as customerUser', 'rider.userId', 'customerUser.idUser')
            ->join('tripPaymentForm', 'rider.tripPaymentFormId', 'tripPaymentForm.idTripPaymentForm')
            ->join('origin', 'trip.originId', 'origin.idOrigin')
            ->leftJoin('destination', 'trip.destinationId', 'destination.idDestination')
            ->leftJoin('driver', 'trip.driverId', 'driver.idDriver')
            ->leftJoin('user as driverUser', 'driver.userId', 'driverUser.idUser')
            ->when(isset($roleAuthUser->support) && !$roleAuthUser->support, function (Builder $query) use ($roleAuthUser) {
                $query->whereIn('trip.cityId', function (\Illuminate\Database\Query\Builder $query) use ($roleAuthUser) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleCity.roleId', $roleAuthUser->id);
                });
            })
            ->when(isset($request['dateStart']), function (Builder $query) use ($request) {
                $query->where('date', '>=', Carbon::parse($request['dateStart'])->startOfDay());
            })
            ->when(isset($request['dateEnd']), function (Builder $query) use ($request) {
                $query->where('date', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
            })
            ->when(isset($request['driverId']), function (Builder $query) use ($request) {
                $query->where('trip.driverId', '=', $request['driverId']);
            })
            ->when(isset($request['status']), function (Builder $query) use ($request) {
                $query->where('status', $request['status']);
            })
            ->when(isset($request['tripPaymentFormId']), function (Builder $query) use ($request) {
                $query->where('trip.tripPaymentFormId', $request['tripPaymentFormId']);
            })
            ->when(isset($request['tripCallTypeId']), function (Builder $query) use ($request) {
                $query->where('trip.tripCallTypeId', $request['tripCallTypeId']);
            })
            ->when(isset($request['cityId']), function (Builder $query) use ($request) {
                $query->where('trip.cityId', $request['cityId']);
            })
            ->when(isset($request['tripTypeId']), function (Builder $query) use ($request) {
                $query->where('trip.tripTypeId', $request['tripTypeId']);
            })
            ->orderBy('trip.date')
            ->get();
    }

    public function totalQuantityByTripTypeAndCity(array $request, array $driverIds, Role $role = null): Collection
    {
        $quantities = $this->getModel()::select(
            DB::raw("
                CONCAT(
                    COUNT(trip.idTrip),'/',
                    COUNT(IF(trip.status = 'canceled', 1, null)),'/',
                    COUNT(IF(trip.status = 'finished', 1, null))
                ) AS quantity
            "),
            DB::raw("COUNT(trip.idTrip) quantityTrips"),
            DB::raw("COUNT(IF(trip.status = 'canceled', 1, null)) quantityCanceled"),
            DB::raw("COUNT(IF(trip.status = 'finished', 1, null)) quantityFinished"),
            'trip.tripTypeId',
            'tripType.type'
        )
            ->join('tripType', 'trip.tripTypeId', 'tripType.idTripType')
            ->whereBetween('trip.date', [
                Carbon::parse($request['dateStart'])->startOfDay(),
                Carbon::parse($request['dateEnd'])->endOfDay(),
            ])
            ->where('trip.status', '<>', 'payment_refused')
            ->when(!empty($driverIds), function (Builder $query) use ($driverIds) {
                $query->whereIn('trip.driverId', $driverIds);
            })
            ->when(isset($request['cities']) && isset($request['cities'][0]), function (Builder $query) use ($request) {
                $query->whereIn('trip.cityId', $request['cities']);
            })
            ->when(isset($role) && !$role->support, function (Builder $query) use ($role) {
                $query->whereIn('trip.cityId', function (\Illuminate\Database\Query\Builder $query) use ($role) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleId', $role->id);
                });
            })
            ->groupBy('trip.tripTypeId')
            ->get();

        $quantities->push([
            'quantity' => $quantities->sum('quantityTrips') . '/' . $quantities->sum('quantityCanceled') . '/' . $quantities->sum('quantityFinished'),
            'quantityTrips' => $quantities->sum('quantityTrips'),
            'quantityCanceled' => $quantities->sum('quantityCanceled'),
            'quantityFinished' => $quantities->sum('quantityFinished'),
            'tripTypeId' => 0,
            'type' => 'Total'
        ]);

        return $quantities;
    }
    public function totalQuantityByTripTypeAndCityAllDrivers(array $request, Role $role = null): Collection
    {
        $quantities = $this->getModel()::select(
            DB::raw("
                CONCAT(
                    COUNT(trip.idTrip),'/',
                    COUNT(IF(trip.status = 'canceled', 1, null)),'/',
                    COUNT(IF(trip.status = 'finished', 1, null))
                ) AS quantity
            "),
            DB::raw("COUNT(trip.idTrip) quantityTrips"),
            DB::raw("COUNT(IF(trip.status = 'canceled', 1, null)) quantityCanceled"),
            DB::raw("COUNT(IF(trip.status = 'finished', 1, null)) quantityFinished"),
            'trip.tripTypeId',
            'tripType.type'
        )
            ->join('tripType', 'trip.tripTypeId', 'tripType.idTripType')
            ->whereBetween('trip.date', [
                Carbon::parse($request['dateStart'])->startOfDay(),
                Carbon::parse($request['dateEnd'])->endOfDay(),
            ])
            ->where('trip.status', '<>', 'payment_refused')
            ->when(isset($request['driverId']), function (Builder $query) use ($request) {
                $query->where('trip.driverId', $request['driverId']);
            })
            ->when(isset($request['cities']) && isset($request['cities'][0]), function (Builder $query) use ($request) {
                $query->whereIn('trip.cityId', $request['cities']);
            })
            ->when(isset($role) && !$role->support, function (Builder $query) use ($role) {
                $query->whereIn('trip.cityId', function (\Illuminate\Database\Query\Builder $query) use ($role) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleId', $role->id);
                });
            })
            ->groupBy('trip.tripTypeId')
            ->get();

        $quantities->push([
            'quantity' => $quantities->sum('quantityTrips') . '/' . $quantities->sum('quantityCanceled') . '/' . $quantities->sum('quantityFinished'),
            'quantityTrips' => $quantities->sum('quantityTrips'),
            'quantityCanceled' => $quantities->sum('quantityCanceled'),
            'quantityFinished' => $quantities->sum('quantityFinished'),
            'tripTypeId' => 0,
            'type' => 'Total'
        ]);

        return $quantities;
    }

    public function movedBillingValues(array $request, array $driverIds, Role $role = null): Collection
    {
        $movedBillingValues = $this->getModel()::select(
            DB::raw("ROUND(SUM(trip.price), 2) AS total"),
            DB::raw("
                ROUND(SUM(
                    CASE
                        WHEN driverCommission.valueType = '$' THEN
                            trip.price - (trip.price - driverCommission.value)
                        ELSE
                            trip.price * (driverCommission.value / 100)
                    END
                ), 2) AS commission
            "),
            'tripType.idTripType',
            'tripType.type'
        )
            ->join('tripType', 'trip.tripTypeId', 'tripType.idTripType')
            ->join('driverCommission', 'trip.driverCommissionId', 'driverCommission.idDriverCommission')
            ->whereBetween('trip.date', [
                Carbon::parse($request['dateStart'])->startOfDay()->toDateTimeString(),
                Carbon::parse($request['dateEnd'])->endOfDay()->toDateTimeString()
            ])
            ->where('trip.status', 'finished')
            ->when(!empty($driverIds), function (Builder $query) use ($driverIds) {
                $query->whereIn('trip.driverId', $driverIds);
            })
            ->when(isset($request['cities']) && isset($request['cities'][0]), function (Builder $query) use ($request) {
                $query->whereIn('trip.cityId', $request['cities']);
            })
            ->when(isset($role) && !$role->support, function (Builder $query) use ($role) {
                $query->whereIn('trip.cityId', function (\Illuminate\Database\Query\Builder $query) use ($role) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleId', $role->id);
                });
            })
            ->groupBy('tripType.idTripType')
            ->get();

        $movedBillingValues->push([
            'total' => $movedBillingValues->sum('total'),
            'commission' => $movedBillingValues->sum('commission'),
            'idTripType' => 0,
            'type' => 'Total',
        ]);

        return $movedBillingValues;
    }
    public function movedBillingValuesAllDrivers(array $request, Role $role = null): Collection
    {
        $movedBillingValues = $this->getModel()::select(
            DB::raw("ROUND(SUM(trip.price), 2) AS total"),
            DB::raw("
                ROUND(SUM(
                    CASE
                        WHEN driverCommission.valueType = '$' THEN
                            trip.price - (trip.price - driverCommission.value)
                        ELSE
                            trip.price * (driverCommission.value / 100)
                    END
                ), 2) AS commission
            "),
            'tripType.idTripType',
            'tripType.type'
        )
            ->join('tripType', 'trip.tripTypeId', 'tripType.idTripType')
            ->join('driverCommission', 'trip.driverCommissionId', 'driverCommission.idDriverCommission')
            ->whereBetween('trip.date', [
                Carbon::parse($request['dateStart'])->startOfDay()->toDateTimeString(),
                Carbon::parse($request['dateEnd'])->endOfDay()->toDateTimeString()
            ])
            ->where('trip.status', 'finished')
            ->when(isset($request['driverId']), function (Builder $query) use ($request) {
                $query->where('trip.driverId', $request['driverId']);
            })
            ->when(isset($request['cities']) && isset($request['cities'][0]), function (Builder $query) use ($request) {
                $query->whereIn('trip.cityId', $request['cities']);
            })
            ->when(isset($role) && !$role->support, function (Builder $query) use ($role) {
                $query->whereIn('trip.cityId', function (\Illuminate\Database\Query\Builder $query) use ($role) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleId', $role->id);
                });
            })
            ->groupBy('tripType.idTripType')
            ->get();

        $movedBillingValues->push([
            'total' => $movedBillingValues->sum('total'),
            'commission' => $movedBillingValues->sum('commission'),
            'idTripType' => 0,
            'type' => 'Total',
        ]);

        return $movedBillingValues;
    }

    public function tripTotalPriceByPaymentForm(array $request, array $driverIds, Role $role = null): Collection
    {
        $tripTotalValue = $this->getModel()::query()->select(
            DB::raw("ROUND(SUM(trip.price), 2) AS total"),
            DB::raw("
                ROUND(SUM(
                    CASE
                        WHEN driverCommission.valueType = '$' THEN
                            trip.price - (trip.price - driverCommission.value)
                        ELSE
                            trip.price * (driverCommission.value / 100)
                    END
                ), 2) AS commission,
                tripPaymentForm.name AS paymentForm
            "),
            'trip.tripPaymentFormId',
            'tripPaymentForm.name AS paymentForm'
        )
            ->join('tripPaymentForm', 'trip.tripPaymentFormId', 'tripPaymentForm.idTripPaymentForm')
            ->join('driverCommission', 'trip.driverCommissionId', 'driverCommission.idDriverCommission')
            ->whereBetween('trip.date', [
                Carbon::parse($request['dateStart'])->startOfDay()->toDateTimeString(),
                Carbon::parse($request['dateEnd'])->endOfDay()->toDateTimeString()
            ])
            ->where('trip.status', 'finished')
            ->when(!empty($driverIds), function (Builder $query) use ($driverIds) {
                $query->whereIn('trip.driverId', $driverIds);
            })
            ->when(isset($request['cities']) && isset($request['cities'][0]), function (Builder $query) use ($request) {
                $query->whereIn('trip.cityId', $request['cities']);
            })
            ->when(isset($role) && !$role->support, function (Builder $query) use ($role) {
                $query->whereIn('trip.cityId', function (\Illuminate\Database\Query\Builder $query) use ($role) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleId', $role->id);
                });
            })
            ->groupBy('trip.tripPaymentFormId')
            ->get();

        $tripTotalValue->push([
            'total' => $tripTotalValue->sum('total'),
            'commission' => $tripTotalValue->sum('commission'),
            'tripPaymentFormId' => 0,
            'paymentForm' => 'Total',
        ]);

        return $tripTotalValue;
    }
    public function tripTotalPriceByPaymentFormAllDrivers(array $request, Role $role = null): Collection
    {
        $tripTotalValue = $this->getModel()::query()->select(
            DB::raw("ROUND(SUM(trip.price), 2) AS total"),
            DB::raw("
                ROUND(SUM(
                    CASE
                        WHEN driverCommission.valueType = '$' THEN
                            trip.price - (trip.price - driverCommission.value)
                        ELSE
                            trip.price * (driverCommission.value / 100)
                    END
                ), 2) AS commission,
                tripPaymentForm.name AS paymentForm
            "),
            'trip.tripPaymentFormId',
            'tripPaymentForm.name AS paymentForm'
        )
            ->join('tripPaymentForm', 'trip.tripPaymentFormId', 'tripPaymentForm.idTripPaymentForm')
            ->join('driverCommission', 'trip.driverCommissionId', 'driverCommission.idDriverCommission')
            ->whereBetween('trip.date', [
                Carbon::parse($request['dateStart'])->startOfDay()->toDateTimeString(),
                Carbon::parse($request['dateEnd'])->endOfDay()->toDateTimeString()
            ])
            ->where('trip.status', 'finished')
            ->when(isset($request['driverId']), function (Builder $query) use ($request) {
                $query->where('trip.driverId', $request['driverId']);
            })
            ->when(isset($request['cities']) && isset($request['cities'][0]), function (Builder $query) use ($request) {
                $query->whereIn('trip.cityId', $request['cities']);
            })
            ->when(isset($role) && !$role->support, function (Builder $query) use ($role) {
                $query->whereIn('trip.cityId', function (\Illuminate\Database\Query\Builder $query) use ($role) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleId', $role->id);
                });
            })
            ->groupBy('trip.tripPaymentFormId')
            ->get();

        $tripTotalValue->push([
            'total' => $tripTotalValue->sum('total'),
            'commission' => $tripTotalValue->sum('commission'),
            'tripPaymentFormId' => 0,
            'paymentForm' => 'Total',
        ]);

        return $tripTotalValue;
    }

    public function totalTaxFee(array $request, array $driverIds, Role $role = null): Collection
    {
        $totalTaxFee = $this->getModel()::select(
            DB::raw("SUM(price.tax_price) as total"),
            'trip.tripTypeId',
            'tripType.type'
        )
            ->join('price', 'trip.priceId', 'price.id')
            ->join('tripType', 'trip.tripTypeId', 'tripType.idTripType')
            ->whereBetween('trip.date', [
                Carbon::parse($request['dateStart'])->startOfDay()->toDateTimeString(),
                Carbon::parse($request['dateEnd'])->endOfDay()->toDateTimeString()
            ])
            ->where('trip.status', 'finished')
            ->when(!empty($driverIds), function (Builder $query) use ($driverIds) {
                $query->whereIn('trip.driverId', $driverIds);
            })
            ->when(isset($request['cities']) && isset($request['cities'][0]), function (Builder $query) use ($request) {
                $query->whereIn('trip.cityId', $request['cities']);
            })
            ->when(isset($role) && !$role->support, function (Builder $query) use ($role) {
                $query->whereIn('trip.cityId', function (\Illuminate\Database\Query\Builder $query) use ($role) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleId', $role->id);
                });
            })
            ->groupBy('trip.tripTypeId')
            ->get();

        $totalTaxFee->push([
            'total' => $totalTaxFee->sum('total'),
            'tripTypeId' => 0,
            'type' => 'Total',
        ]);

        return $totalTaxFee;
    }
    public function totalTaxFeeAllDrivers(array $request, Role $role = null): Collection
    {
        $totalTaxFee = $this->getModel()::select(
            DB::raw("SUM(price.tax_price) as total"),
            'trip.tripTypeId',
            'tripType.type'
        )
            ->join('price', 'trip.priceId', 'price.id')
            ->join('tripType', 'trip.tripTypeId', 'tripType.idTripType')
            ->whereBetween('trip.date', [
                Carbon::parse($request['dateStart'])->startOfDay()->toDateTimeString(),
                Carbon::parse($request['dateEnd'])->endOfDay()->toDateTimeString()
            ])
            ->where('trip.status', 'finished')
            ->when(isset($request['driverId']), function (Builder $query) use ($request) {
                $query->where('trip.driverId', $request['driverId']);
            })
            ->when(isset($request['cities']) && isset($request['cities'][0]), function (Builder $query) use ($request) {
                $query->whereIn('trip.cityId', $request['cities']);
            })
            ->when(isset($role) && !$role->support, function (Builder $query) use ($role) {
                $query->whereIn('trip.cityId', function (\Illuminate\Database\Query\Builder $query) use ($role) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleId', $role->id);
                });
            })
            ->groupBy('trip.tripTypeId')
            ->get();

        $totalTaxFee->push([
            'total' => $totalTaxFee->sum('total'),
            'tripTypeId' => 0,
            'type' => 'Total',
        ]);

        return $totalTaxFee;
    }

    public function callProduction(array $request = [], User $authUser = null)
    {
        return $this->getModel()
            ::join('tripAudit', 'trip.tripAuditId', '=', 'tripAudit.id')
            ->join('tripPaymentForm', 'trip.tripPaymentFormId', '=', 'tripPaymentForm.idTripPaymentForm')
            ->join('tripType', 'trip.tripTypeId', '=', 'tripType.idTripType')
            ->join('tripCallType as tc', 'trip.tripCallTypeId', '=', 'tc.id')
            ->leftJoin('rewardCampaignTrip as rCT', 'trip.tripReference', '=', 'rCT.tripReference')
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
            ->leftJoin('tripCancellationCustomerFee as tCCF', 'trip.tripReference', '=', 'utd.idUserType')
            ->leftJoin('tripDiscountCoupon as tDC', 'trip.tripReference', '=', 'tDC.tripReference')
            ->leftJoin('userDiscountCoupon as uDC', 'tDC.userDiscountCouponId', '=', 'uDC.id')
            ->leftJoin('discountCoupon as dC2', 'uDC.discountCouponId', '=', 'dC2.id')
            ->leftJoin('balanceFlow as bfpf', function (JoinClause $join) {
                $join->where('bfpf.balanceFlowTypeId', BalanceFlowTypeConst::BALANCE_OUT_RATE_PAYMENT_FORM)
                    ->on('bfpf.tripReference', 'trip.tripReference');
            })
            ->leftJoin('balanceFlow as bfof', function (JoinClause $join) {
                $join->where('bfof.balanceFlowTypeId', BalanceFlowTypeConst::COMMITTEES_EXIT)
                    ->on('bfof.tripReference', 'trip.tripReference');
            })
            ->leftJoin('recalculatedTrip', 'trip.tripReference', 'recalculatedTrip.tripReference')
            ->when(isset($authUser->role->support) && !$authUser->role->support, function (Builder $query) use ($authUser) {
                $query->whereIn('trip.cityId', function (\Illuminate\Database\Query\Builder $query) use ($authUser) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleCity.roleId', $authUser->roleId);
                });
            })
            ->select([
                'trip.idTrip',
                'trip.tripReference',
                'trip.date',
                'trip.endDate',
                'trip.price',
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
                'trip.cityId',
                'trip.description',
                'nome AS cityName',
                'ud.name as driverName',
                'ud.email as driverEmail',
                'driver.profileImage as driverPhoto',
                'lad.userTypeId as driverTypeId',
                'utd.name as driverType',
                'ud.phone as driverPhone',
                DB::raw('ifnull(`recalculatedTrip`.`newDistance`, `trip`.`distance`) as `distance`'),
                DB::raw('ifnull(`recalculatedTrip`.`newTripTime`, `trip`.`estimatedTripTime`) as `estimatedTripTime`'),
                'trip.tripTypeId as tripTypeId',
                'trip.tripCallTypeId as tripCallTypeId',
                'trip.customerId as customerId',
                'trip.zoneId as zoneId',
                'trip.tripPaymentFormId as tripPaymentFormId',
                'uc.platform as platform',
                'uc.name as createdByName',
                'uc.email as createdByEmail',
                'tCCF.feeValue as cancellationFee',
                'cR.name as cancellationReasons',
                'dC2.code as discountCoupon',
                DB::raw('round((ifnull(rT.value, 0) + ifnull(rCT.value, 0)), 2) as driverReward'),
                DB::raw('(case
                    when (trip.centralCustomerId is not null) then convert(centralCustomer.name using utf8mb4)
                    when (trip.tripCustomerId is not null) then convert(cp.name using utf8mb4)
                    when (trip.customerId is not null) then convert(ct.name using utf8mb4)
                    else uc.name end) as customerName'),
                DB::raw('(case
                    when (trip.centralCustomerId is not null) then convert(centralCustomerUser.email using utf8mb4)
                    when (trip.tripCustomerId is not null) then convert(cp.email using utf8mb4)
                    when (trip.customerId is not null) then \'\'
                    else uc.email end) as customerEmail'),
                DB::raw('coalesce(centralCustomerProfile.profileImage, c.profileImage) as customerPhoto'),
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
                round((trip.price * (dC.value / 100)), 2)) as appValue'),
                DB::raw('round(bfpf.value, 2) as paymentFormFee'),
                DB::raw('round(bfof.value, 2) - if((dC.valueType = \'$\'), round(dC.value, 2),
                                 round((trip.price * (dC.value / 100)), 2)) as otherFee'),
                DB::raw('if((dC.valueType = \'$\'),
          round((trip.price - ifnull(round(bfof.value, 2), round(dC.value, 2)) - ifnull(round(bfpf.value, 2), 0)), 2),
          round((trip.price - ifnull(round(bfof.value, 2), round(trip.price * (dC.value / 100), 2)) -
                 ifnull(round(bfpf.value, 2), 0)),
                2))                                                         as driverValue'),
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
            ->selectSub(function (\Illuminate\Database\Query\Builder $query) {
                $query->selectRaw("group_concat(concat(doc.label, '- ', docUser.text))")
                    ->from('docUserType')
                    ->join('doc', 'docUserType.docId', 'doc.id')
                    ->join('docUser', 'doc.id', 'docUser.docId')
                    ->whereColumn('docUser.userId', 'trip.userId')
                    ->where('docUserType.userTypeId', 5)
                    ->where('doc.statusId', StatusConst::ACTIVE)
                    ->where('docUserType.statusId', StatusConst::ACTIVE)
                    ->groupBy('docUser.userId');
            }, 'documents')
            ->groupBy('trip.tripReference')
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
            ->when(isset($request['dateStart']), function (Builder $query) use ($request) {
                $query->where('trip.date', '>=', Carbon::parse($request['dateStart'])->startOfDay());
            })
            ->when(isset($request['dateEnd']), function (Builder $query) use ($request) {
                $query->where('trip.date', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
            })
            ->when(isset($request['tripPaymentFormId']), function (Builder $query) use ($request) {
                $query->where('trip.tripPaymentFormId', $request['tripPaymentFormId']);
            })
            ->when(isset($request['tripCallTypeId']), function (Builder $query) use ($request) {
                $query->where('trip.tripCallTypeId', $request['tripCallTypeId']);
            })
            ->when(isset($request['driverId']), function (Builder $query) use ($request) {
                $query->where('trip.driverId', $request['driverId']);
            })
            ->when(isset($request['userId']), function (Builder $query) use ($request) {
                $query->where('trip.userId', $request['userId']);
            })
            ->when(isset($request['status']), function (Builder $query) use ($request) {
                $query->where('trip.status', $request['status']);
            })
            ->when(isset($request['cityId']), function (Builder $query) use ($request) {
                $query->where('trip.cityId', $request['cityId']);
            })
            ->when(isset($request['callSourceType']), function (Builder $query) use ($request) {
                if ($request['callSourceType'] == TripCallTypeConst::NORMAL_CALL) {
                    $query->where('trip.tripCallTypeId', '<>', TripCallTypeConst::CENTRAL_CALL);
                }
                if ($request['callSourceType'] == TripCallTypeConst::CENTRAL_CALL) {
                    $query->where('trip.tripCallTypeId', '=', TripCallTypeConst::CENTRAL_CALL);
                }
            })
            ->orderBy('trip.idTrip')
            ->get();
    }

}

