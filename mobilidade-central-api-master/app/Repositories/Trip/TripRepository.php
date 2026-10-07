<?php

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/06/2019
 * Time: 16:41
 */

namespace App\Repositories\Trip;


use App\Constants\PaginationConst;
use App\Constants\Trip\TripConst;
use App\Contracts\Repository\AbstractRepository;
use App\Realtimes\Trip\Trip as RealtimeTrip;
use App\Models\Trip\Trip;
use DateTime;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Pagination\LengthAwarePaginator;

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

    /**
     * @param Trip $trip
     * @return Trip
     * @throws \Exception
     */
    public function persist(Trip $trip)
    {
        try {
            \DB::beginTransaction();

            $trip->save();

            \DB::commit();
        } catch (\Exception $e) {

            \DB::rollBack();
            throw $e;
        }

        return $trip;
    }

    public function findByReference($tripReference, $with = [])
    {
        return $this->getModel()
            ::where('tripReference', $tripReference)
            ->with($with)
            ->first();
    }

    public function findFully($tripReference, $with = [])
    {
        $trip = $this->getModel()
            ::where('tripReference', $tripReference)
            ->join('tripPaymentForm', 'tripPaymentFormId', '=', 'idTripPaymentForm')
            ->join('tripType', 'tripTypeId', '=', 'idTripType')
            ->join('tripAudit', 'tripAuditId', '=', 'id')
            ->join('city', 'cityId', '=', 'city.id')
            ->with(array_merge($with, ['customer', 'user.customer']))
            ->select([
                'idTrip',
                'tripReference',
                'date',
                'endDate',
                'haveReturn',
                'price',
                'priceId',
                'driverId',
                'userId',
                'tripTypeId',
                'tripPaymentFormId',
                'status',
                'canceledBy',
                'tripPaymentForm.name AS tripPaymentForm',
                'tripType.type AS tripType',
                'situation',
                'originId',
                'destinationId',
                'centralId',
                'centralCustomerId',
                'scheduledBatchId',
                'favoriteDrivers',
                'cityId',
                'nome AS cityName'
            ])
            ->with([
                'origin' => function (BelongsTo $query) {
                    $query
                        ->select([
                            'idOrigin',
                            'address',
                            'address AS name',
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
                            'address AS name',
                            'neighborhood',
                            'latitude',
                            'longitude',
                        ]);
                },
                'driver' => function ($query) {
                    $query
                        ->join('user', 'driver.userId', '=', 'idUser')
                        ->with('car')
                        ->select([
                            'idDriver',
                            'userId',
                            'driver.appVersion',
                            'profileImage',
                            'driver.cityId',
                            'driver.last_lat AS latitude',
                            'driver.last_lon AS longitude',
                            'user.name AS name',
                            'user.nickname AS nickname',
                            'user.email AS email',
                            'user.phone AS phone',
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
            ->first();

        return $this->fillCustomerData($trip);
    }

    private function fillCustomerData($trip)
    {
        if (!$trip || !$trip->customer) {
            return $trip;
        }

        $tripUser = $trip->user;
        $tripUserCustomer = optional($tripUser)->customer;

        foreach ([
            'name' => optional($tripUser)->name,
            'nickname' => optional($tripUser)->nickname,
            'profileImage' => optional($tripUserCustomer)->profileImage,
        ] as $field => $value) {
            if (empty($trip->customer->{$field})) {
                $trip->customer->{$field} = $value;
            }
        }

        return $trip;
    }

    public function findByCentral($centralId, $request_query = null)
    {
        $driverId = $request_query['driverId'] ?? null;
        $status = $request_query['status'] ?? null;
        $date = $request_query['date'] ?? null;
        $customerName = $request_query['customerName'] ?? null;
        $isScheduled = $status === TripConst::SCHEDULED;

        return $this->getModel()::where('trip.centralId', '=', $centralId)
            ->when($driverId, function (Builder $query, $driverId) {
                $query
                    ->where('trip.driverId', '=', $driverId);
            })
            ->when($status, function (Builder $query, $status) {
                $query
                    ->where('trip.status', '=', $status);
            })
            ->when($date, function (Builder $query) use ($date, $isScheduled) {
                $isScheduled
                    ? $query->whereBetween('tripScheduled.schedule', $date)
                    : $query->whereBetween('trip.date', $date);
            })
            ->when($customerName, function (Builder $query, $customerName) {
                $query
                    ->where('centralCustomer.name', 'LIKE', "%{$customerName}%");
            })
            ->join('tripPaymentForm', 'tripPaymentFormId', '=', 'idTripPaymentForm')
            ->join('tripType', 'tripTypeId', '=', 'idTripType')
            ->join('tripAudit', 'trip.tripAuditId', '=', 'tripAudit.id')
            ->join('city', 'cityId', '=', 'city.id')
            ->leftJoin('tripScheduled', 'trip.tripReference', '=', 'tripScheduled.tripReference')
            ->leftJoin('centralCustomer', 'trip.centralCustomerId', '=', 'centralCustomer.id')
            ->select([
                'trip.idTrip',
                'trip.tripReference',
                'trip.haveReturn',
                'trip.date',
                'trip.endDate',
                'trip.price',
                'trip.driverId',
                'trip.userId',
                'trip.tripTypeId',
                'trip.status',
                'trip.distance',
                'trip.estimatedTripTime',
                'trip.canceledBy',
                'tripPaymentForm.name AS tripPaymentForm',
                'tripType.type AS tripType',
                'situation',
                'trip.originId',
                'trip.destinationId',
                'trip.centralCustomerId',
                'trip.cityId',
                'nome AS cityName',
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
            ->orderByRaw('tripScheduled.schedule IS NULL')
            ->orderBy('tripScheduled.schedule', 'ASC')
            ->orderByDesc('trip.date')
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

    public function updateByTripReference($tripReference, array $values)
    {
        $values = array_map(function ($item) {
            return "" . $item;
        }, $values);

        return $this->getModel()
            ::where('tripReference', $tripReference)
            ->update($values);
    }

    public function findTripsSearchingTooLong(int $minutes = 10)
    {
        $dateLimit = (new DateTime())->modify("-{$minutes} minutes")->format('Y-m-d H:i:s');

        return $this->getModel()::select(['tripReference', 'status', 'date', 'centralId', 'userId'])
            ->where('date', '<=', $dateLimit)
            ->whereIn('status', ['searching_favorite', 'searching'])
            ->whereNotNull('centralId')
            ->get();
    }

    public function findActivesByCentral($centralId, $with = [], $filters = [])
    {
        $flow = $filters['flow'] ?? null;
        $customerName = $filters['customerName'] ?? null;
        $driverName = $filters['driverName'] ?? null;
        $status = $filters['status'] ?? null;

        $trips = $this->getModel()
            ::where('trip.centralId', $centralId)
            ->when($flow, function (Builder $query, $flow) {
                $query->where('trip.flow', $flow);
            })
            ->when($customerName, function (Builder $query, $customerName) {
                $query->where('centralCustomer.name', 'LIKE', "%{$customerName}%");
            })
            ->when($driverName, function (Builder $query, $driverName) {
                $query->where('driverUser.name', 'LIKE', "%{$driverName}%");
            })
            ->when($status, function (Builder $query, $status) {
                $query->where('trip.status', $status);
            })
            ->whereNotIn('trip.status', [
                TripConst::CANCELED,
                TripConst::FINISHED,
                TripConst::BACK_OFF,
                TripConst::NOT_ANSWERED,
                TripConst::PAYMENT_REFUSED,
            ])
            ->join('tripPaymentForm', 'tripPaymentFormId', '=', 'idTripPaymentForm')
            ->join('tripType', 'tripTypeId', '=', 'idTripType')
            ->leftJoin('centralCustomer', 'trip.centralCustomerId', '=', 'centralCustomer.id')
            ->leftJoin('tripScheduled', 'trip.tripReference', '=', 'tripScheduled.tripReference')
            // Só pra permitir filtrar por nome do motorista (driverName) — os
            // dados do motorista em si continuam vindo do with('driver') abaixo.
            ->leftJoin('driver', 'trip.driverId', '=', 'driver.idDriver')
            ->leftJoin('user AS driverUser', 'driver.userId', '=', 'driverUser.idUser')
            ->with(['origin', 'destination', 'tripWayPoints', 'customer', 'user.customer'])
            ->with($with)
            ->with([
                'driver' => function ($query) {
                    $query
                        ->join('user', 'driver.userId', '=', 'idUser')
                        ->with('car')
                        ->select([
                            'idDriver',
                            'userId',
                            'profileImage',
                            'driver.cityId',
                            'driver.last_lat AS latitude',
                            'driver.last_lon AS longitude',
                            'user.name AS name',
                            'user.nickname AS nickname',
                            'user.email AS email',
                            'user.phone AS phone',
                        ]);
                }
            ])
            ->select([
                'trip.*',
                'tripPaymentForm.name AS tripPaymentForm',
                'tripType.type AS tripType',
            ])
            ->orderByRaw('tripScheduled.schedule IS NULL')
            ->orderBy('tripScheduled.schedule', 'ASC')
            ->orderBy('trip.date', 'DESC')
            ->paginate(PaginationConst::LIMIT_PER_PAGE);

        $trips->getCollection()->each(function ($trip) {
            $this->fillCustomerData($trip);
        });

        return $trips;
    }

    public function countScheduledActivesByCentral($centralId, $filters = [])
    {
        $flow = $filters['flow'] ?? null;
        $customerName = $filters['customerName'] ?? null;
        $driverName = $filters['driverName'] ?? null;

        return $this->getModel()
            ::where('trip.centralId', $centralId)
            ->where('trip.status', TripConst::SCHEDULED)
            ->when($flow, function (Builder $query, $flow) {
                $query->where('trip.flow', $flow);
            })
            ->when($customerName, function (Builder $query, $customerName) {
                $query
                    ->leftJoin('centralCustomer', 'trip.centralCustomerId', '=', 'centralCustomer.id')
                    ->where('centralCustomer.name', 'LIKE', "%{$customerName}%");
            })
            ->when($driverName, function (Builder $query, $driverName) {
                $query
                    ->leftJoin('driver', 'trip.driverId', '=', 'driver.idDriver')
                    ->leftJoin('user AS driverUser', 'driver.userId', '=', 'driverUser.idUser')
                    ->where('driverUser.name', 'LIKE', "%{$driverName}%");
            })
            ->count();
    }

    public function findEditableBatchSiblings(string $scheduledBatchId, string $excludeTripReference)
    {
        return $this->getModel()
            ::where('scheduledBatchId', $scheduledBatchId)
            ->where('tripReference', '!=', $excludeTripReference)
            ->where('status', TripConst::SCHEDULED)
            ->get();
    }

    public function findScheduledTripsDelayedNoDriver()
    {
        $now = (new DateTime())->format('Y-m-d H:i:s');

        return $this->getModel()::select(['tripReference', 'status', 'date', 'centralId', 'userId'])
            ->where('status', 'scheduled')
            ->whereNull('driverId')
            ->whereHas('schedule', function ($query) use ($now) {
                $query->where('schedule', '<', $now);
            })
            ->whereNotNull('centralId')
            ->get();
    }
}
