<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/06/2019
 * Time: 10:15
 */

namespace App\Repositories\User;


use App\Constants\PaginationConst;
use App\Constants\StatusConst;
use App\Constants\Trip\TripConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\User\Driver;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class DriverRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(Driver::class);
    }

    public function findPosition($id)
    {
        return $this->find($id, [
            'idDriver',
            'status',
            'last_lat AS latitude',
            'last_lon AS longitude'
        ]);
    }

    public function findByCentral($centralId)
    {
        return $this->getModel()
        ::whereHas('central', function (Builder $query) use ($centralId){
            $query
                ->where('statusId', StatusConst::ACTIVE)
                ->where('centralId', $centralId);
        })
        ->leftJoin(DB::raw('(SELECT driverId, MAX(id) as max_id FROM refusedDriver where statusId = 1 GROUP BY driverId) as rd'), 'rd.driverId', '=', 'idDriver')
        ->select([
            'idDriver',
            'profileImage',
            'last_lat AS latitude',
            'last_lon AS longitude',
            'driverRegisterStatusId',
            'status',
            'userId',
            'rd.max_id AS blockedId',
        ])
        ->with(['user' => function(BelongsTo $query){
            $query
                ->join('levelAccess', 'levelAccess.userId', '=', 'user.idUser')
                ->select([
                    'user.idUser',
                    'user.name',
                    'user.nickname',
                    'user.email',
                    'user.phone',
                    'user.created_at',
                    'levelAccess.userTypeId',
                ]);
        }])
        ->groupBy(
            'driver.idDriver',
        )
        ->havingRaw('COUNT(*) = 1')
        ->paginate(PaginationConst::LIMIT_PER_PAGE);
    }

    /**
     * Dentre os $driverIds informados, retorna os que NÃO estão vinculados
     * (via levelAccess.userTypeId -> tripTypeDriver) ao $tripTypeId informado.
     * Um motorista com mais de um levelAccess (mais de uma categoria) é
     * considerado apto se QUALQUER uma delas estiver vinculada ao tripType.
     *
     * @param int[] $driverIds
     * @param int $tripTypeId
     * @return \Illuminate\Support\Collection
     */
    public function findIneligibleForTripType(array $driverIds, int $tripTypeId)
    {
        if (empty($driverIds)) {
            return collect();
        }

        $eligibleDriverIds = $this->getModel()
            ::whereIn('idDriver', $driverIds)
            ->join('user', 'user.idUser', '=', 'driver.userId')
            ->join('levelAccess', 'levelAccess.userId', '=', 'user.idUser')
            ->join('tripTypeDriver', function ($join) use ($tripTypeId) {
                $join
                    ->on('tripTypeDriver.userTypeId', '=', 'levelAccess.userTypeId')
                    ->where('tripTypeDriver.tripTypeId', $tripTypeId);
            })
            ->pluck('idDriver')
            ->unique();

        $ineligibleDriverIds = array_values(array_diff($driverIds, $eligibleDriverIds->all()));

        if (empty($ineligibleDriverIds)) {
            return collect();
        }

        return $this->getModel()
            ::whereIn('idDriver', $ineligibleDriverIds)
            ->join('user', 'user.idUser', '=', 'driver.userId')
            ->select(['idDriver', 'user.name'])
            ->get();
    }

    public function findWithActiveTrips($driverId)
    {
        return $this->getModel()
            ::where('idDriver', $driverId)
            ->select([
                'driver.*'
            ])
            ->with(['trips' => function (HasMany $query){
                 $query
                    ->join('tripPaymentForm', 'tripPaymentFormId', '=', 'idTripPaymentForm')
                    ->join('tripType', 'tripTypeId', '=', 'idTripType')
                    ->join('tripAudit', 'tripAuditId', '=', 'id')
                    ->join('city', 'cityId', '=', 'city.id')
                    ->join('user', 'userId', '=', 'idUser')
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
                        'trip.cityId',
                        'nome AS cityName',
                        'nickname AS customerName',
                    ])
                    ->with([
                        'origin' => function (BelongsTo $query){
                            $query
                                ->select([
                                    'idOrigin',
                                    'address',
                                    'neighborhood',
                                    'latitude',
                                    'longitude',
                                ]);
                        },
                        'destination' => function (BelongsTo $query){
                            $query
                                ->select([
                                    'idDestination',
                                    'address',
                                    'neighborhood',
                                    'latitude',
                                    'longitude',
                                ]);
                        },
                        'tripWayPoints' => function (HasMany $query){
                            $query
                                ->select([
                                    'tripReference',
                                    'latitude',
                                    'longitude',
                                    'address',
                                ]);
                        },
                        'customer' => function (BelongsTo $query){
                            $query
                                ->join('central', 'centralId', '=', 'id')
                                ->select([
                                    'centralCustomer.id',
                                    'centralCustomer.name AS name',
                                    'centralCustomer.name AS nickname',
                                    'phone',
                                    'logo AS profileImage',
                                ]);
                        }
                    ])
                    ->whereNotIn('status', [
                        TripConst::FINISHED, TripConst::CANCELED
                    ])
                    ->orderBy('idTrip');
            }])
            ->get();
    }
}
