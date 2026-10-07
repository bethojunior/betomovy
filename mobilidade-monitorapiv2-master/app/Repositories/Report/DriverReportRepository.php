<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 19/02/2020
 * Time: 10:30
 */

namespace App\Repositories\Report; 


use App\Constants\RemoveAccount\RemoveAccountRequestConst;
use App\Constants\StatusConst;
use App\Constants\Trip\TripConst;
use App\Constants\Trip\TripHistoryConst;
use App\Constants\Users\DriverRegisterStatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\ReadOnly\Trip\DriverRO;
use App\Models\Role\Role;
use App\Models\User\RefusedCustomer;
use App\Models\User\RemoveAccount\RemoveAccountRequestModel;
use App\Models\User\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\DB;

class DriverReportRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(DriverRO::class);
    }

    /**
     * @param array $request
     * @return mixed
     */
    public function findAll(array $request = [], User $authUser = null)
    {
        return $this->getModel()
            ::join('user', 'driver.userId', '=', 'idUser')
            ->where('user.statusId', StatusConst::ACTIVE)
            ->join('driverRegisterStatus', 'driverRegisterStatusId', '=', 'idDriverRegisterStatus')
            ->join('car', 'car.driverId', '=', 'idDriver')
            ->join('levelAccess', 'driver.userId', '=', 'levelAccess.userId')
            ->join('userType', 'levelAccess.userTypeId', '=', 'userType.idUserType')
            ->join('balance', 'driver.balanceId', '=', 'balance.idBalance')
            ->leftJoin('city', 'driver.cityId', '=', 'city.id')
            ->when(isset($authUser->role->support) && !$authUser->role->support, function (Builder $query) use ($authUser) {
                $query->whereIn('driver.cityId', function (\Illuminate\Database\Query\Builder $query) use ($authUser) {
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
                'userType.name AS userType',
                'driverRegisterStatus.name AS driverRegisterStatus',
                'car.plate',
                'car.brand',
                'car.model',
                'car.color',
                'car.year',
                'city.nome AS cityName',
                'balance.balance',
                'user.created_at',
                DB::raw('
                    COALESCE((SELECT count(t.tripReference)
                    FROM trip t
                    WHERE t.driverId = driver.idDriver
                       AND t.status = \'finished\'
                    GROUP BY t.driverId
                    ), 0) as quantityTripsFinished
                ')
            )
            ->orderByDesc('user.created_at')
            ->where(function (Builder $query) {
                $query->whereNull('car.pending')
                    ->orWhere('car.pending', 0);
            })
            ->whereNull('car.deleted_at')
            ->when(isset($request['name']), function (Builder $query) use ($request) {
                $query
                    ->where('user.name', 'LIKE', "%{$request['name']}%");
            })
            ->when(isset($request['dateStart']), function (Builder $query) use ($request) {
                $query
                    ->where('user.created_at', '>', $request['dateStart']);
            })
            ->when(isset($request['dateEnd']), function (Builder $query) use ($request) {
                $query
                    ->where('user.created_at', '<', $request['dateEnd']);
            })
            ->when(isset($request['driverRegisterStatusId']), function (Builder $query) use ($request) {
                $query
                    ->where('idDriverRegisterStatus', '=', $request['driverRegisterStatusId']);
            })
            ->when(isset($request['cityId']), function (Builder $query) use ($request) {
                $query
                    ->where('driver.cityId', '=', $request['cityId']);
            })
            ->get();
    }

    /**
     * @param array $request
     * @return Builder[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model[]|\Illuminate\Database\Query\Builder[]|\Illuminate\Support\Collection|mixed[]
     */
    public function tripHistory(array $request, User $authUser = null)
    {
        return $this->getModel()
            ::join('user', 'userId', '=', 'idUser')
            ->where('user.statusId', StatusConst::ACTIVE)
            ->join('driverRegisterStatus', 'driverRegisterStatusId', '=', 'idDriverRegisterStatus')
            ->when(isset($authUser->role->support) && !$authUser->role->support, function (Builder $query) use ($authUser) {
                $query->whereIn('driver.cityId', function (\Illuminate\Database\Query\Builder $query) use ($authUser) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleCity.roleId', $authUser->roleId);
                });
            })
            ->when(isset($request['driverId']), function (Builder $query) use ($request) {
                $query->where('idDriver', $request['driverId']);
            })
            ->when(isset($request['driverRegisterStatusId']), function (Builder $query) use ($request) {
                $query
                    ->where('idDriverRegisterStatus', '=', $request['driverRegisterStatusId']);
            })
            ->when(isset($request['cityId']), function (Builder $query) use ($request) {
                $query
                    ->where('driver.cityId', '=', $request['cityId']);
            })
            ->select(
                'idDriver',
                'user.name',
                'driverRegisterStatus.name as driverRegisterStatus'
            )
            ->withCount([
                'tripHistory AS called' => function (Builder $query) use ($request) {
                    $query
                        ->whereBetween(
                            'date', [
                            Carbon::parse($request['dateStart'])->startOfDay(),
                            Carbon::parse($request['dateEnd'])->endOfDay()
                        ]);
                },
                'trips AS allowed' => function (Builder $query) use ($request) {
                    $query
                        ->whereBetween(
                            'date', [
                            Carbon::parse($request['dateStart'])->startOfDay(),
                            Carbon::parse($request['dateEnd'])->endOfDay()
                        ]);
                },
                'tripHistory AS refused' => function (Builder $query) use ($request) {
                    $query
                        ->whereBetween(
                            'date', [
                            Carbon::parse($request['dateStart'])->startOfDay(),
                            Carbon::parse($request['dateEnd'])->endOfDay()
                        ])
                        ->where('status', TripHistoryConst::STATUS_DENIED);
                },
                'trips AS canceledByDriver' => function (Builder $query) use ($request) {
                    $query
                        ->whereBetween(
                            'date', [
                            Carbon::parse($request['dateStart'])->startOfDay(),
                            Carbon::parse($request['dateEnd'])->endOfDay()
                        ])
                        ->where('status', TripConst::CANCELED)
                        ->where('canceledBy', TripConst::CANCELED_BY_DRIVER);
                },
                'trips AS canceledByCustomer' => function (Builder $query) use ($request) {
                    $query
                        ->whereBetween(
                            'date', [
                            Carbon::parse($request['dateStart'])->startOfDay(),
                            Carbon::parse($request['dateEnd'])->endOfDay()
                        ])
                        ->where('status', TripConst::CANCELED)
                        ->where('canceledBy', TripConst::CANCELED_BY_CUSTOMER);
                },
                'trips AS finished' => function (Builder $query) use ($request) {
                    $query
                        ->whereBetween(
                            'date', [
                            Carbon::parse($request['dateStart'])->startOfDay(),
                            Carbon::parse($request['dateEnd'])->endOfDay()
                        ])
                        ->where('status', TripConst::FINISHED);
                },
            ])
            ->selectRaw("
                IFNULL((
                    SELECT
                        ROUND(SUM(trip.price), 2)
                    FROM trip
                        WHERE
                            trip.driverId = idDriver AND
                            trip.date BETWEEN ? AND ? AND
                            trip.status = 'finished'
                ), 0) AS totalValue
            ", [
                Carbon::parse($request['dateStart'])->startOfDay(),
                Carbon::parse($request['dateEnd'])->endOfDay()
            ])
            ->get();
    }

    /**
     * @param array $request
     * @return array|\Illuminate\Database\Concerns\BuildsQueries[]|Builder[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model[]
     */
    public function historyDriverAllTripsValues(array $request = [], Role $role = null)
    {
        return $this->getModel()
            ::join('user', 'userId', '=', 'idUser')
            ->join('trip', 'driver.idDriver', '=', 'trip.driverId')
            ->join('city', 'driver.cityId', '=', 'city.id')
            ->where('user.statusId', StatusConst::ACTIVE)
            ->when(isset($request['cityId']), function (Builder $query) use ($request) {
                $query
                    ->where('driver.cityId', $request['cityId']);
            })
            ->when(isset($role) && !$role->support && !isset($request['cityId']), function (Builder $query) use ($role) {
                $query
                    ->whereIn('driver.cityId', function (\Illuminate\Database\Query\Builder $query) use ($role) {
                        $query->select('roleCity.cityId')
                            ->from('roleCity')
                            ->where('roleCity.roleId', $role->id);
                    });
            })
            ->select(
                'user.name',
                'city.nome as cityName'
            )
            ->selectSub(function ($query) use ($request) {
                $query
                    ->selectRaw("COUNT(trip.driverId)")
                    ->from('trip')
                    ->whereRaw('trip.driverId = idDriver')
                    ->when(isset($request['tripPaymentFormId']), function ($query) use ($request) {
                        $query
                            ->where('tripPaymentFormId', $request['tripPaymentFormId']);
                    })
                    ->when(isset($request['status']), function ($query) use ($request) {
                        $query->where('trip.status', $request['status']);
                    });

                $query = $this->getFilters($query, $request);

            }, 'tripCount')
            ->selectSub(function ($query) use ($request) {
                $query
                    ->selectRaw("
                        COUNT(favoriteDriver.driverId)
                    ")
                    ->from('favoriteDriver')
                    ->whereRaw('favoriteDriver.driverId = idDriver')
                    ->where('favoriteDriver.status', '=', 1)
                    ->when(isset($request['dateStart']), function ($query) use ($request) {
                        $query
                            ->where('favoriteDriver.created_at', '>=', Carbon::parse($request['dateStart'])->startOfDay());
                    })
                    ->when(isset($request['dateEnd']), function ($query) use ($request) {
                        $query
                            ->where('favoriteDriver.created_at', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
                    });
            }, 'numberCustomersHaveFavoriteThisDriver')
            ->selectSub(function ($query) use ($request) {
                $query
                    ->selectRaw('
                        ROUND(SUM(trip.price), 2)')
                    ->from('trip')
                    ->whereRaw('trip.driverId = idDriver')
                    ->when(isset($request['tripPaymentFormId']), function ($query) use ($request) {
                        $query
                            ->where('tripPaymentFormId', $request['tripPaymentFormId']);
                    })
                    ->when(isset($request['status']), function ($query) use ($request) {
                        $query->where('trip.status', $request['status']);
                    });

                $query = $this->getFilters($query, $request);

            }, 'totalValueTrips')
            ->selectSub(function ($query) use ($request) {
                $query
                    ->selectRaw('
                        ROUND(SUM(IF(
                           driverCommission.valueType = \'$\',
                           ROUND(trip.price - (trip.price - driverCommission.value), 2),
                           ROUND(trip.price - (trip.price * (driverCommission.value / 100)), 2)
                       )), 2)')
                    ->from('trip')
                    ->join('driverCommission', 'trip.driverCommissionId', '=', 'driverCommission.idDriverCommission')
                    ->whereRaw('trip.driverId = idDriver')
                    ->when(isset($request['tripPaymentFormId']), function ($query) use ($request) {
                        $query
                            ->where('tripPaymentFormId', $request['tripPaymentFormId']);
                    })
                    ->when(isset($request['status']), function ($query) use ($request) {
                        $query->where('trip.status', $request['status']);
                    });

                $query = $this->getFilters($query, $request);

            }, 'totalValueDriver')
            ->selectSub(function ($query) use ($request) {
                $query
                    ->selectRaw("
                        SUM(IF(driverCommission.valueType = '$',
                        ROUND(trip.price - driverCommission.value, 2),
                        ROUND(trip.price * (driverCommission.value / 100), 2)))
                    ")
                    ->from('trip')
                    ->join('driverCommission', 'trip.driverCommissionId', 'driverCommission.idDriverCommission')
                    ->whereRaw('trip.driverId = idDriver')
                    ->when(isset($request['tripPaymentFormId']), function ($query) use ($request) {
                        $query
                            ->where('tripPaymentFormId', $request['tripPaymentFormId']);
                    })
                    ->when(isset($request['status']), function ($query) use ($request) {
                        $query->where('trip.status', $request['status']);
                    });

                $query = $this->getFilters($query, $request);

            }, 'totalValueApp')
            ->orderByDesc('idDriver')
            ->groupBy('idDriver')
            ->when(isset($request['name']), function ($query) use ($request) {
                $query
                    ->where('user.name', 'LIKE', "%{$request['name']}%");
            })
            ->when(isset($request['driverId']), function ($query) use ($request) {
                $query
                    ->where('idDriver', $request['driverId']);
            })
            ->get();
    }

    /**
     * @param array $queryRequest
     * @return array|\Illuminate\Database\Concerns\BuildsQueries[]|Builder[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model[]
     */
    public function driverOnlineTime(array $queryRequest = [], Role $authRole = null)
    {
        return $this->getModel()
            ::join('user', 'userId', '=', 'idUser')
            ->join('driverOnlineTime', 'idDriver', '=', 'driverId')
            ->leftJoin('city', 'driver.cityId', '=', 'city.id')
            ->where('user.statusId', StatusConst::ACTIVE)
            ->whereNotNull('driverOnlineTime.time_out')
            ->select(
                'user.name',
                'user.document',
                'city.nome AS cityName',
                DB::raw("DATE_FORMAT(driverOnlineTime.time_in, '%d/%m/%Y') AS
             dateLogin")
            )
            ->selectSub("
                COUNT(DATE_FORMAT(driverOnlineTime.time_in, '%d/%m/%Y'))
            ", 'numberOfLogins')
            ->selectSub("
                    SUM(TIMESTAMPDIFF
                        (MINUTE,
                            driverOnlineTime.time_in,
                            driverOnlineTime.time_out)
                        )
            ", 'minutesLogin')
            ->groupBy(DB::raw("DATE_FORMAT(`driverOnlineTime`.`time_in`, '%d/%m/%Y'), `user`.`name`, `user`.`document`"))
            ->orderByDesc('time_in')
            ->when(!$authRole->support, function (Builder $query) use ($authRole) {
                $query->whereIn('driver.cityId', function (\Illuminate\Database\Query\Builder $query) use ($authRole) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleCity.roleId', $authRole->id);
                });
            })
            ->when(isset($queryRequest['driverId']), function (Builder $query) use ($queryRequest) {
                $query
                    ->where('idDriver', $queryRequest['driverId']);
            })
            ->when(isset($queryRequest['cityId']), function (Builder $query) use ($queryRequest) {
                $query
                    ->where('driver.cityId', $queryRequest['cityId']);
            })
            ->when(isset($queryRequest['dateStart']),
                function (Builder $query) use ($queryRequest) {
                    $query
                        ->where(
                            'driverOnlineTime.time_in', '>=',
                            Carbon::parse($queryRequest['dateStart'])->startOfDay());
                })
            ->when(isset($queryRequest['dateEnd']),
                function (Builder $query) use ($queryRequest) {
                    $query
                        ->where(
                            'driverOnlineTime.time_in', '<=',
                            Carbon::parse($queryRequest['dateEnd'])->endOfDay());
                })
            ->get();
    }

    /**
     * @param $query
     * @param array $request
     * @return mixed
     */
    public function getFilters($query, array $request = [])
    {
        return $query
            ->when(isset($request['dateStart']), function ($query) use ($request) {
                $query
                    ->where('trip.date', '>=', Carbon::parse($request['dateStart'])->startOfDay());
            })
            ->when(isset($request['dateEnd']), function ($query) use ($request) {
                $query
                    ->where('trip.date', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
            });

    }

    public function feeManagement(array $request = [], Role $roleAuthUser = null)
    {
        return $this->getModel()
            ::join('user', 'driver.userId', '=', 'idUser')
            ->where('user.statusId', StatusConst::ACTIVE)
            ->join('driverRegisterStatus', 'driverRegisterStatusId', '=', 'idDriverRegisterStatus')
            ->join('levelAccess', 'driver.userId', '=', 'levelAccess.userId')
            ->join('userType', 'levelAccess.userTypeId', '=', 'userType.idUserType')
            ->join('balance', 'driver.balanceId', '=', 'balance.idBalance')
            ->leftJoin('city', 'driver.cityId', '=', 'city.id')
            ->select(
                'user.name',
                'user.document',
                'user.phone',
                'user.email',
                'userType.name AS userType',
                'driverRegisterStatus.name AS driverRegisterStatus',
                'city.nome AS cityName',
                'balance.balance'
            )
            ->selectSub(function (\Illuminate\Database\Query\Builder $query) use ($request) {
                $query->select(DB::raw('ROUND(SUM(trip.price), 2)'))
                    ->from('trip')
                    ->join('tripPaymentForm', 'trip.tripPaymentFormId', 'tripPaymentForm.idTripPaymentForm')
                    ->whereRaw('trip.driverId = driver.idDriver')
                    ->where('trip.status', 'finished')
                    ->where('tripPaymentForm.paymentFormTypeId', 2)
                    ->groupBy('trip.driverId')
                    ->when(isset($request['dateStart']), function (\Illuminate\Database\Query\Builder $query) use ($request) {
                        $query->where('trip.date', '>=', Carbon::parse($request['dateStart'])->startOfDay());
                    })
                    ->when(isset($request['dateEnd']), function (\Illuminate\Database\Query\Builder $query) use ($request) {
                        $query->where('trip.date', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
                    });
            }, 'quantityTripsPayCash')
            ->selectSub(function (\Illuminate\Database\Query\Builder $query) use ($request) {
                $query->select(DB::raw('ROUND(SUM(trip.price), 2)'))
                    ->from('trip')
                    ->join('tripPaymentForm', 'trip.tripPaymentFormId', 'tripPaymentForm.idTripPaymentForm')
                    ->whereRaw('trip.driverId = driver.idDriver')
                    ->where('trip.status', 'finished')
                    ->where('tripPaymentForm.paymentFormTypeId', 3)
                    ->groupBy('trip.driverId')
                    ->when(isset($request['dateStart']), function (\Illuminate\Database\Query\Builder $query) use ($request) {
                        $query->where('trip.date', '>=', Carbon::parse($request['dateStart'])->startOfDay());
                    })
                    ->when(isset($request['dateEnd']), function (\Illuminate\Database\Query\Builder $query) use ($request) {
                        $query->where('trip.date', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
                    });
            }, 'quantityTripsPayCreditCard')
            ->selectSub(function (\Illuminate\Database\Query\Builder $query) use ($request) {
                $query->select(DB::raw('ROUND(SUM(trip.price), 2)'))
                    ->from('trip')
                    ->join('tripPaymentForm', 'trip.tripPaymentFormId', 'tripPaymentForm.idTripPaymentForm')
                    ->whereRaw('trip.driverId = driver.idDriver')
                    ->where('trip.status', 'finished')
                    ->where('tripPaymentForm.paymentFormTypeId', 1)
                    ->groupBy('trip.driverId')
                    ->when(isset($request['dateStart']), function (\Illuminate\Database\Query\Builder $query) use ($request) {
                        $query->where('trip.date', '>=', Carbon::parse($request['dateStart'])->startOfDay());
                    })
                    ->when(isset($request['dateEnd']), function (\Illuminate\Database\Query\Builder $query) use ($request) {
                        $query->where('trip.date', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
                    });
            }, 'quantityTripsPayVoucher')
            ->selectSub(function (\Illuminate\Database\Query\Builder $query) use ($request) {
                $query->select(DB::raw('ROUND(SUM(trip.price), 2)'))
                    ->from('trip')
                    ->join('tripPaymentForm', 'trip.tripPaymentFormId', 'tripPaymentForm.idTripPaymentForm')
                    ->whereRaw('trip.driverId = driver.idDriver')
                    ->where('trip.status', 'finished')
                    ->where('tripPaymentForm.paymentFormTypeId', 4)
                    ->groupBy('trip.driverId')
                    ->when(isset($request['dateStart']), function (\Illuminate\Database\Query\Builder $query) use ($request) {
                        $query->where('trip.date', '>=', Carbon::parse($request['dateStart'])->startOfDay());
                    })
                    ->when(isset($request['dateEnd']), function (\Illuminate\Database\Query\Builder $query) use ($request) {
                        $query->where('trip.date', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
                    });
            }, 'quantityTripsPayCardInLocal')
            ->selectSub(function (\Illuminate\Database\Query\Builder $query) use ($request) {
                $query->select(DB::raw('ROUND(SUM(trip.price), 2)'))
                    ->from('trip')
                    ->join('tripPaymentForm', 'trip.tripPaymentFormId', 'tripPaymentForm.idTripPaymentForm')
                    ->whereRaw('trip.driverId = driver.idDriver')
                    ->where('trip.status', 'finished')
                    ->whereIn('tripPaymentForm.paymentFormTypeId', [1, 2, 3, 4])
                    ->groupBy('trip.driverId')
                    ->when(isset($request['dateStart']), function (\Illuminate\Database\Query\Builder $query) use ($request) {
                        $query->where('trip.date', '>=', Carbon::parse($request['dateStart'])->startOfDay());
                    })
                    ->when(isset($request['dateEnd']), function (\Illuminate\Database\Query\Builder $query) use ($request) {
                        $query->where('trip.date', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
                    });
            }, 'amountTotalTrips')
            ->selectSub(function (\Illuminate\Database\Query\Builder $query) use ($request) {
                $query->select(DB::raw('ROUND(SUM(IF(driverCommissionPaymentForm.valueType = \'$\', driverCommissionPaymentForm.value, (trip.price * (driverCommissionPaymentForm.value / 100)))), 2)'))
                    ->from('trip')
                    ->join('tripPaymentForm', 'trip.tripPaymentFormId', 'tripPaymentForm.idTripPaymentForm')
                    ->join('driverCommission', function (JoinClause $join) {
                        $join->on('trip.tripTypeId', 'driverCommission.tripTypeId')
                            ->on('trip.cityId', 'driverCommission.cityId');
                    })
                    ->join('driverCommissionPaymentForm', function (JoinClause $join) {
                        $join->on('driverCommission.idDriverCommission', 'driverCommissionPaymentForm.driverCommissionId')
                            ->on('tripPaymentForm.idTripPaymentForm', 'driverCommissionPaymentForm.tripPaymentFormId');
                    })
                    ->whereRaw('trip.driverId = driver.idDriver')
                    ->where('trip.status', 'finished')
                    ->whereIn('tripPaymentForm.paymentFormTypeId', [1, 2, 3, 4])
                    ->groupBy('trip.driverId')
                    ->when(isset($request['dateStart']), function (\Illuminate\Database\Query\Builder $query) use ($request) {
                        $query->where('trip.date', '>=', Carbon::parse($request['dateStart'])->startOfDay());
                    })
                    ->when(isset($request['dateEnd']), function (\Illuminate\Database\Query\Builder $query) use ($request) {
                        $query->where('trip.date', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
                    });
            }, 'feesByPaymentForm')
            ->when(isset($roleAuthUser->support) && !$roleAuthUser->support, function (Builder $query) use ($roleAuthUser) {
                $query->whereIn('driver.cityId', function (\Illuminate\Database\Query\Builder $query) use ($roleAuthUser) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleCity.roleId', $roleAuthUser->id);
                });
            })
            ->orderByDesc('user.created_at')
            ->when(isset($request['name']), function (Builder $query) use ($request) {
                $query
                    ->where('user.name', 'LIKE', "%{$request['name']}%");
            })
            ->when(isset($request['dateStartDriverRegister']), function (Builder $query) use ($request) {
                $query
                    ->where('user.created_at', '>=', Carbon::parse($request['dateStartDriverRegister'])->startOfDay());
            })
            ->when(isset($request['dateEndDriverRegister']), function (Builder $query) use ($request) {
                $query
                    ->where('user.created_at', '<=', Carbon::parse($request['dateEndDriverRegister'])->endOfDay());
            })
            ->when(isset($request['driverRegisterStatusId']), function (Builder $query) use ($request) {
                $query
                    ->where('idDriverRegisterStatus', '=', $request['driverRegisterStatusId']);
            })
            ->when(isset($request['cityId']), function (Builder $query) use ($request) {
                $query
                    ->where('driver.cityId', '=', $request['cityId']);
            })
            ->get();
    }

    public function balanceDrivers(array $request = [], Role $role = null): Collection
    {
        return $this->getModel()::query()->select(
            'driver.idDriver',
            'user.name',
            'user.email',
            'user.phone',
            'user.document',
            'balance.balance',
            'city.nome as city'
        )
            ->join('balance', 'driver.balanceId', 'balance.idBalance')
            ->join('user', 'driver.userId', 'user.idUser')
            ->leftJoin('city', 'driver.cityId', 'city.id')
            ->where('user.statusId', StatusConst::ACTIVE)
            ->orderBy('balance.balance')
            ->when(isset($role) && !$role->support, function (Builder $query) use ($role) {
                $query->whereIn('driver.cityId', function (\Illuminate\Database\Query\Builder $query) use ($role) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleId', $role->id);
                });
            })
            ->when(isset($request['driverId']), function (Builder $query) use ($request) {
                $query->where('driver.idDriver', $request['driverId']);
            })
            ->when(isset($request['cityId']), function (Builder $query) use ($request) {
                $query->where('driver.cityId', $request['cityId']);
            })
            ->when(isset($request['dateStart']), function (Builder $query) use ($request) {
                $query->where('user.created_at', '>=', Carbon::parse($request['dateStart'])->startOfDay());
            })
            ->when(isset($request['dateEnd']), function (Builder $query) use ($request) {
                $query->where('user.created_at', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
            })
            ->get();
    }

    public function blockedDrivers(array $request = [], Role $role = null): Collection
    {
        return $this->getModel()::query()->select(
            'driver.idDriver',
            'user.name',
            'user.email',
            'user.phone',
            'user.document',
            'balance.balance',
            'city.nome as city'
        )
            ->join('balance', 'driver.balanceId', 'balance.idBalance')
            ->join('user', 'driver.userId', 'user.idUser')
            ->leftJoin('city', 'driver.cityId', 'city.id')
            ->where('user.statusId', StatusConst::ACTIVE)
            ->where('driver.driverRegisterStatusId', DriverRegisterStatusConst::BLOCKED)
            ->orderBy('user.name')
            ->when(isset($role) && !$role->support, function (Builder $query) use ($role) {
                $query->whereIn('driver.cityId', function (\Illuminate\Database\Query\Builder $query) use ($role) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleId', $role->id);
                });
            })
            ->when(isset($request['driverId']), function (Builder $query) use ($request) {
                $query->where('driver.idDriver', $request['driverId']);
            })
            ->when(isset($request['cityId']), function (Builder $query) use ($request) {
                $query->where('driver.cityId', $request['cityId']);
            })
            ->when(isset($request['dateStart']), function (Builder $query) use ($request) {
                $query->where('user.created_at', '>=', Carbon::parse($request['dateStart'])->startOfDay());
            })
            ->when(isset($request['dateEnd']), function (Builder $query) use ($request) {
                $query->where('user.created_at', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
            })
            ->get();
    }

    public function activeDrivers(array $request, array $driverIds, Role $role = null): Collection
    {
        $activeDrivers = $this->getModel()::query()->select(
            DB::raw("
            CONCAT(
                COUNT(DISTINCT trip.driverId),'/',
                COUNT(
                    DISTINCT IF(trip.status = 'canceled' AND trip.canceledBy = 'driver', trip.driverId, null)
                ), '/',
                COUNT(DISTINCT IF(trip.status = 'finished', trip.driverId, null))
            ) AS quantity
        "),
            DB::raw("COUNT(DISTINCT trip.driverId) as quantityDrivers"),
            DB::raw("COUNT(DISTINCT IF(trip.status = 'canceled' AND trip.canceledBy = 'driver', trip.driverId, null)) as quantityDriversCanceled"),
            DB::raw("COUNT(DISTINCT IF(trip.status = 'finished', trip.driverId, null)) as quantityDriversFinished"),
            'levelAccess.userTypeId',
            'userType.name AS type'
        )
            ->join('trip', 'driver.idDriver', 'trip.driverId')
            ->join('tripType', 'trip.tripTypeId', 'tripType.idTripType')
            ->join('levelAccess', 'driver.userId', 'levelAccess.userId')
            ->join('userType', 'levelAccess.userTypeId', 'userType.idUserType')
            ->when(isset($request['driverId']), function (Builder $query) use ($request) {
                $query->whereIn('trip.driverId', $request['driverId']);
            })
            ->when(isset($driverIds) && count($driverIds) > 0, function (Builder $query) use ($driverIds) {
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
            ->groupBy('levelAccess.userTypeId')
            ->get();

        $activeDrivers->push([
            'quantity' => $activeDrivers->sum('quantityDrivers') . '/' . $activeDrivers->sum('quantityDriversCanceled') . '/' . $activeDrivers->sum('quantityDriversFinished'),
            'quantityDrivers' => $activeDrivers->sum('quantityDrivers'),
            'quantityDriversCanceled' => $activeDrivers->sum('quantityDriversCanceled'),
            'quantityDriversFinished' => $activeDrivers->sum('quantityDriversFinished'),
            'userTypeId' => 0,
            'type' => 'Total'
        ]);

        return $activeDrivers;
    }
    public function activeDriversAll(array $request, Role $role = null): Collection
    {
        $activeDrivers = $this->getModel()::query()->select(
            DB::raw("
                CONCAT(
                    COUNT(DISTINCT trip.driverId),'/',
                    COUNT(
                        DISTINCT IF(trip.status = 'canceled' AND trip.canceledBy = 'driver', trip.driverId, null)
                    ), '/',
                    COUNT(DISTINCT IF(trip.status = 'finished', trip.driverId, null))
                ) AS quantity
            "),
            DB::raw("COUNT(DISTINCT trip.driverId) as quantityDrivers"),
            DB::raw("COUNT(DISTINCT IF(trip.status = 'canceled' AND trip.canceledBy = 'driver', trip.driverId, null)) as quantityDriversCanceled"),
            DB::raw("COUNT(DISTINCT IF(trip.status = 'finished', trip.driverId, null)) as quantityDriversFinished"),
            'levelAccess.userTypeId',
            'userType.name AS type'
        )
            ->join('trip', 'driver.idDriver', 'trip.driverId')
            ->join('tripType', 'trip.tripTypeId', 'tripType.idTripType')
            ->join('levelAccess', 'driver.userId', 'levelAccess.userId')
            ->join('userType', 'levelAccess.userTypeId', 'userType.idUserType')
            ->whereBetween('trip.date', [
                Carbon::parse($request['dateStart'])->startOfDay()->toDateTimeString(),
                Carbon::parse($request['dateEnd'])->endOfDay()->toDateTimeString()
            ])
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
            ->groupBy('levelAccess.userTypeId')
            ->get();

        $activeDrivers->push([
            'quantity' => $activeDrivers->sum('quantityDrivers') . '/' . $activeDrivers->sum('quantityDriversCanceled') . '/' . $activeDrivers->sum('quantityDriversFinished'),
            'quantityDrivers' => $activeDrivers->sum('quantityDrivers'),
            'quantityDriversCanceled' => $activeDrivers->sum('quantityDriversCanceled'),
            'quantityDriversFinished' => $activeDrivers->sum('quantityDriversFinished'),
            'userTypeId' => 0,
            'type' => 'Total'
        ]);

        return $activeDrivers;
    }

    public function inactiveDrivers(array $request, array $driverIds, Role $role = null): Collection
    {
        $inactiveDrivers = $this->getModel()::query()->select(
            DB::raw("COUNT(driver.idDriver) AS quantity"),
            'levelAccess.userTypeId',
            'userType.name as type'
        )
            ->join('user', 'driver.userId', 'user.idUser')
            ->join('levelAccess', 'user.idUser', 'levelAccess.userId')
            ->join('userType', 'levelAccess.userTypeId', 'userType.idUserType')
            ->when(!empty($driverIds), function (Builder $query) use ($driverIds) {
                $query->whereIn('driver.idDriver', $driverIds);
            })
            ->when(isset($request['cities']) && isset($request['cities'][0]), function (Builder $query) use ($request) {
                $query->whereIn('driver.cityId', $request['cities']);
            })
            ->whereNotIn('driver.idDriver', function (\Illuminate\Database\Query\Builder $query) use ($request, $driverIds) {
                $subquery = $query->select('trip.driverId')
                    ->from('trip')
                    ->whereNotNull('trip.driverId')
                    ->whereBetween('trip.date', [
                        Carbon::parse($request['dateStart'])->startOfDay()->toDateTimeString(),
                        Carbon::parse($request['dateEnd'])->endOfDay()->toDateTimeString()
                    ]);

                if (!empty($driverIds)) {
                    $subquery->whereIn('trip.driverId', $driverIds);
                }

                return $subquery;
            })
            ->when(isset($role) && !$role->support, function (Builder $query) use ($role) {
                $query->whereIn('driver.cityId', function (\Illuminate\Database\Query\Builder $query) use ($role) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleId', $role->id);
                });
            })
            ->groupBy('levelAccess.userTypeId')
            ->get();

        $inactiveDrivers->push([
            'quantity' => $inactiveDrivers->sum('quantity'),
            'userTypeId' => 0,
            'type' => 'Total'
        ]);

        return $inactiveDrivers;
    }
    public function inactiveDriversAll(array $request, Role $role = null): Collection
    {
        $inactiveDrivers = $this->getModel()::query()->select(
            DB::raw("COUNT(driver.idDriver) AS quantity"),
            'levelAccess.userTypeId',
            'userType.name as type'
        )
            ->join('user', 'driver.userId', 'user.idUser')
            ->join('levelAccess', 'user.idUser', 'levelAccess.userId')
            ->join('userType', 'levelAccess.userTypeId', 'userType.idUserType')
            ->when(isset($request['cities']) && isset($request['cities'][0]), function (Builder $query) use ($request) {
                $query->whereIn('driver.cityId', $request['cities']);
            })
            ->when(isset($request['driverId']), function (Builder $query) use ($request) {
                $query->where('driver.idDriver', $request['driverId']);
            })
            ->whereNotIn('driver.idDriver', function (\Illuminate\Database\Query\Builder $query) use ($request) {
                $query->select('trip.driverId')
                    ->from('trip')
                    ->whereNotNull('trip.driverId')
                    ->whereBetween('trip.date', [
                        Carbon::parse($request['dateStart'])->startOfDay()->toDateTimeString(),
                        Carbon::parse($request['dateEnd'])->endOfDay()->toDateTimeString()
                    ])
                    ->when(isset($request['cities']) && isset($request['cities'][0]), function (\Illuminate\Database\Query\Builder $query) use ($request) {
                        $query->whereIn('driver.cityId', $request['cities']);
                    });
            })
            ->when(isset($role) && !$role->support, function (Builder $query) use ($role) {
                $query->whereIn('trip.cityId', function (\Illuminate\Database\Query\Builder $query) use ($role) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleId', $role->id);
                });
            })
            ->groupBy('levelAccess.userTypeId')
            ->get();

        $inactiveDrivers->push([
            'quantity' => $inactiveDrivers->sum('quantity'),
            'userTypeId' => 0,
            'type' => 'Total'
        ]);

        return $inactiveDrivers;
    }

    public function totalDriverBalance(array $request, array $driverIds, Role $role = null): Collection
    {
        $totalDriverBalance = $this->getModel()::query()->select(
            DB::raw("ROUND(SUM(balance.balance), 2) AS total"),
            'levelAccess.userTypeId',
            'userType.name as type'
        )
            ->join('balance', 'driver.balanceId', 'balance.idBalance')
            ->join('user', 'driver.userId', 'user.idUser')
            ->join('levelAccess', 'user.idUser', 'levelAccess.userId')
            ->join('userType', 'levelAccess.userTypeId', 'userType.idUserType')
            ->when(!empty($driverIds), function (Builder $query) use ($driverIds) {
                $query->whereIn('driver.idDriver', $driverIds);
            })
            ->when(isset($request['cities']) && isset($request['cities'][0]), function (Builder $query) use ($request) {
                $query->whereIn('driver.cityId', $request['cities']);
            })
            ->when(isset($role) && !$role->support, function (Builder $query) use ($role) {
                $query->whereIn('driver.cityId', function (\Illuminate\Database\Query\Builder $query) use ($role) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleId', $role->id);
                });
            })
            ->groupBy('levelAccess.userTypeId')
            ->get();

        $totalDriverBalance->push([
            'total' => $totalDriverBalance->sum('total'),
            'userTypeId' => 0,
            'type' => 'Total'
        ]);

        return $totalDriverBalance;
    }
    public function totalDriverBalanceAll(array $request, Role $role = null): Collection
    {
        $totalDriverBalance = $this->getModel()::query()->select(
            DB::raw("ROUND(SUM(balance.balance), 2) AS total"),
            'levelAccess.userTypeId',
            'userType.name as type'
        )
            ->join('balance', 'driver.balanceId', 'balance.idBalance')
            ->join('user', 'driver.userId', 'user.idUser')
            ->join('levelAccess', 'user.idUser', 'levelAccess.userId')
            ->join('userType', 'levelAccess.userTypeId', 'userType.idUserType')
            ->when(isset($request['driverId']), function (Builder $query) use ($request) {
                $query->where('driver.idDriver', $request['driverId']);
            })
            ->when(isset($request['cities']) && isset($request['cities'][0]), function (Builder $query) use ($request) {
                $query->whereIn('driver.cityId', $request['cities']);
            })
            ->when(isset($role) && !$role->support, function (Builder $query) use ($role) {
                $query->whereIn('driver.cityId', function (\Illuminate\Database\Query\Builder $query) use ($role) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleId', $role->id);
                });
            })
            ->groupBy('levelAccess.userTypeId')
            ->get();

        $totalDriverBalance->push([
            'total' => $totalDriverBalance->sum('total'),
            'userTypeId' => 0,
            'type' => 'Total'
        ]);

        return $totalDriverBalance;
    }

    public function customerBlockedByDriver(array $request, User $authUser = null): Collection
    {
        return RefusedCustomer::query()
            ->join('customer', 'refusedCustomer.customerId', '=', 'customer.idCustomer')
            ->join('driver', 'refusedCustomer.driverId', '=', 'driver.idDriver')
            ->join('user as u', 'u.idUser', '=', 'customer.userId')
            ->join('user as um', 'um.idUser', '=', 'driver.userId')
            ->where('refusedCustomer.statusId', '=', StatusConst::ACTIVE)
            ->select(
                'u.name as customerName',
                'um.name as driverName',
                'refusedCustomer.created_at as blockedDateByCustomer'
            )
            ->when(isset($request['userId']), function (Builder $query) use ($request) {
                $query->where('customer.userId', $request['userId']);
            })
            ->when(isset($request['driverId']), function (Builder $query) use ($request) {
                $query->where('driver.idDriver', $request['driverId']);
            })
            ->when(isset($request['startDate']), function (Builder $query) use ($request) {
                $query->where('refusedCustomer.created_at', '>=', Carbon::parse($request['startDate'])->startOfDay());
            })
            ->when(isset($request['endDate']), function (Builder $query) use ($request) {
                $query->where('refusedCustomer.created_at', '<=', Carbon::parse($request['endDate'])->endOfDay());
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

    public function vehicleData(array $request, Role $role = null): Collection
    {
        return $this->getModel()::query()
            ->select(
                'user.name as driverName',
                'driverRegisterStatus.name AS driverRegisterStatus',
                'driver.cnh as driverCnh',
                'car.model as carModel',
                'car.brand as carBrand',
                'car.year as carYear',
                'car.plate as carPlate',
                'car.color as carColor',
                'car.renavam as carRenavam'
            )
            ->leftJoin('car', 'driver.idDriver', 'car.idCar')
            ->join('driverRegisterStatus', 'driverRegisterStatusId', '=', 'idDriverRegisterStatus')
            ->join('user', 'driver.userId', 'user.idUser')
            ->where('car.pending', '=', null)
            ->orWhere('car.pending', '=', 0)
            ->when(isset($request['driverId']), function (Builder $query) use ($request) {
                $query->where('driver.idDriver', $request['driverId']);
            })
            ->when(isset($request['driverRegisterStatusId']), function (Builder $query) use ($request) {
                $query->where('idDriverRegisterStatus', '=', $request['driverRegisterStatusId']);
            })
            ->when(isset($request['cityId']), function (Builder $query) use ($request) {
                $query->where('driver.cityId', $request['cityId']);
            })
            ->when(isset($role) && !$role->support, function (Builder $query) use ($role) {
                $query->whereIn('driver.cityId', function (\Illuminate\Database\Query\Builder $query) use ($role) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleId', $role->id);
                });
            })
            ->get();
    }

    public function driverName(int $driverId): string
    {
        return $this->getModel()::query()
            ->join('user', 'driver.userId', 'user.idUser')
            ->where('driver.idDriver', $driverId)
            ->value('user.name');
    }

    public function excludedDrivers(array $request, Role $role = null): Collection
    {
        return RemoveAccountRequestModel::query()
            ->select(
                'user.name as driverName',
                'user.email as driverEmail',
                'user.phone as driverPhone',
                'city.nome as cityName',
                'removeAccountRequest.created_at as excludedDate'
            )
            ->join('user', 'removeAccountRequest.userId', 'user.idUser')
            ->join('driver', 'user.idUser', 'driver.userId')
            ->join('city', 'removeAccountRequest.cityId', 'city.id')
            ->when(isset($request['driverId']), function (Builder $query) use ($request) {
                $query->where('driver.idDriver', $request['driverId']);
            })
            ->when(isset($request['cityId']), function (Builder $query) use ($request) {
                $query->where('removeAccountRequest.cityId', $request['cityId']);
            })
            ->when(isset($request['startDate']), function (Builder $query) use ($request) {
                $query->where('removeAccountRequest.created_at', '>=', Carbon::parse($request['startDate'])->startOfDay());
            })
            ->when(isset($request['endDate']), function (Builder $query) use ($request) {
                $query->where('removeAccountRequest.created_at', '<=', Carbon::parse($request['endDate'])->endOfDay());
            })
            ->when(isset($role) && !$role->support, function (Builder $query) use ($role) {
                $query->whereIn('driver.cityId', function (\Illuminate\Database\Query\Builder $query) use ($role) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleCity.roleId', $role->id);
                });
            })
            ->where('removeAccountRequest.type', '=', RemoveAccountRequestConst::TYPE_DRIVER)
            ->get();
    }
}
