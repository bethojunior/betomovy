<?php

namespace App\Processor\Monitoring;

use Carbon\Carbon;
use App\Models\Trip\Trip;
use App\Constants\Trip\TripConst;
use App\Constants\StatusConst;
use App\Constants\Central\CentralConst;
use App\Constants\Users\DriverConst;
use App\Helpers\CityIdHelper;
use App\Models\Central\Central;
use App\Repositories\Central\CentralRepository;
use App\Repositories\Locale\CityRepository;
use Illuminate\Database\Eloquent\Collection;
use App\Providers\PulseProvider;
use App\Utils\Pulse\GroupIds;
use Illuminate\Support\Facades\DB;

class MonitoringProcessor
{
    /**
     * @var Trip
     */
    private $trip;
    /**
     * @var PulseProvider
     */
    private $pulseProvider;
    /**
     * @var CentralRepository
     */
    private $centralRepository;
    /**
     * @var CityRepository
     */
    private $cityRepository;

    public const SQL_QUERY_STATEMENT = [
        'fields' => [
            'idTrip',
            'tripReference',
            'date',
            'price',
            'status',
            'driverId',
            'userId',
            'tripTypeId',
            'centralCustomerId',
            'originId',
            'destinationId',
            'cancellationReasonsId',
            'canceledBy',
        ],
        'relations' => [
            'driver:idDriver,userId',
            'driver.user:idUser,name,nickname,phone',
            'driver.car:idCar,driverId,plate,brand,model,color,year',
            'user:idUser,name,phone',
            'tripType:idTripType,type',
            'centralCustomer:id,userId,name,phone',
            'origin:idOrigin,address,neighborhood,latitude,longitude',
            'destination:idDestination,address,neighborhood,latitude,longitude',
            'cancellationReason:idCancellationReasons,name'
        ],
    ];

    public function __construct(Trip $trip, CentralRepository $centralRepository, CityRepository $cityRepository)
    {
        $this->trip = $trip;
        $this->centralRepository = $centralRepository;
        $this->cityRepository = $cityRepository;
        $this->pulseProvider = new PulseProvider("central", GroupIds::CENTRAL_PROD);
    }

    public function execute(int $centralId, ?int $cityId = null): array
    {
        try {
            $response = ['trips' => []];
            $statuses = [
                TripConst::FINISHED,
                TripConst::CANCELED,
                TripConst::ACCEPTED,
                TripConst::IN_PROGRESS,
                TripConst::NOT_ANSWERED,
                TripConst::SCHEDULED,
                TripConst::BOARDING,
            ];

            $now = Carbon::today()->startOfDay()->toDateTimeString();

            $allTrips = $this->trip
                ->whereIn('status', $statuses)
                ->where('date', '>=', $now)
                ->when($cityId, function ($query) use ($cityId) {
                    $query->where('cityId', $cityId);
                })
                ->whereHas('centralCustomer', function ($query) use ($centralId) {
                    $query->where('centralId', $centralId);
                })
                ->with(self::SQL_QUERY_STATEMENT['relations'])
                ->select(self::SQL_QUERY_STATEMENT['fields'])
                ->orderBy('date', 'desc')
                ->get();

            $groupedTrips = $allTrips->groupBy('status');

            foreach ($statuses as $status) {
                $trips = $groupedTrips->get($status, new Collection());
                $response['trips'][$status] = $trips->values()->toArray();
            }

            $response['trips']['total'] = $allTrips->count();

            $central = $this->centralRepository->find($centralId);
            if (!$central) {
                throw new \Exception("Central não encontrada");
            }

            if (!$cityId) {
                $cityId = CityIdHelper::inferFromCentral($central, $this->cityRepository);
                if (!$cityId) {
                    $this->pulseProvider->warning('monitoring', 'Não foi possível inferir cityId das coordenadas da central', [
                        'centralId' => $central->id,
                        'latitude' => $central->latitude,
                        'longitude' => $central->longitude,
                    ]);
                }
            }

            $response['drivers'] = $this->countDriversByStatus($centralId, $cityId, $central->centralCallDriver);

            return $response;
        } catch (\Throwable $e) {
            $this->pulseProvider->error('error', 'Erro ao processar monitoramento', [
                'centralId' => $centralId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    private function countDriversByStatus(int $centralId, ?int $cityId = null, ?string $centralCallDriver = null): array
    {
        $totalQuery = $this->buildTotalDriversQuery($centralId, $cityId, $centralCallDriver);
        $totalQuery->whereIn('driver.status', [DriverConst::AVAILABLE, DriverConst::IN_TRIP]);
        $totalDrivers = $totalQuery->groupBy('driver.idDriver')->get()->count();

        $availableQuery = $this->buildTotalDriversQuery($centralId, $cityId, $centralCallDriver);
        $availableQuery->where(function ($q) {
            $q->where('driver.status', DriverConst::AVAILABLE)
                ->orWhere(function ($subQuery) {
                    $subQuery->where('driver.status', DriverConst::IN_TRIP)
                        ->where('driver.preAvailable', 1);
                });
        });
        $availableCount = $availableQuery->groupBy('driver.idDriver')->get()->count();

        $occupiedQuery = $this->buildTotalDriversQuery($centralId, $cityId, $centralCallDriver);
        $occupiedQuery->where('driver.status', DriverConst::IN_TRIP)
            ->where(function ($q) {
                $q->whereNull('driver.preAvailable')
                    ->orWhere('driver.preAvailable', '!=', 1);
            });
        $occupiedCount = $occupiedQuery->groupBy('driver.idDriver')->get()->count();

        return [
            'available' => $availableCount,
            'occupied' => $occupiedCount,
            'total' => $totalDrivers,
        ];
    }

    private function buildTotalDriversQuery(int $centralId, ?int $cityId = null, ?string $centralCallDriver = null)
    {
        if ($centralCallDriver === CentralConst::ONLY_APP_DRIVERS) {
            $query = DB::connection('mysql_ro')
                ->table('driver')
                ->select('driver.idDriver', 'driver.status', 'driver.preAvailable', 'driver.last_lat', 'driver.last_lon')
                ->whereNotIn('driver.idDriver', function ($subQuery) {
                    $subQuery->select('driverId')
                        ->from('centralDriver')
                        ->where('statusId', StatusConst::ACTIVE);
                })
                ->join('user', 'user.idUser', '=', 'driver.userId')
                ->join('levelAccess', 'levelAccess.userId', '=', 'user.idUser')
                ->join('userType', 'userType.idUserType', '=', 'levelAccess.userTypeId');
        } elseif ($centralCallDriver === CentralConst::ALL_DRIVERS) {
            $query = DB::connection('mysql_ro')
                ->table('driver')
                ->select('driver.idDriver', 'driver.status', 'driver.preAvailable', 'driver.last_lat', 'driver.last_lon')
                ->join('user', 'user.idUser', '=', 'driver.userId')
                ->join('levelAccess', 'levelAccess.userId', '=', 'user.idUser')
                ->join('userType', 'userType.idUserType', '=', 'levelAccess.userTypeId');
        } else {
            $query = DB::connection('mysql_ro')
                ->table('centralDriver')
                ->select('driver.idDriver', 'driver.status', 'driver.preAvailable', 'driver.last_lat', 'driver.last_lon')
                ->join('driver', 'centralDriver.driverId', '=', 'driver.idDriver')
                ->join('user', 'user.idUser', '=', 'driver.userId')
                ->join('levelAccess', 'levelAccess.userId', '=', 'user.idUser')
                ->join('userType', 'userType.idUserType', '=', 'levelAccess.userTypeId')
                ->where('centralDriver.centralId', $centralId)
                ->where('centralDriver.statusId', StatusConst::ACTIVE);
        }

        if ($cityId) {
            $query->whereExists(function ($subQuery) use ($cityId) {
                $subQuery->select(DB::raw(1))
                    ->from('cityArea')
                    ->where('cityArea.cityId', $cityId)
                    ->where('cityArea.statusId', StatusConst::ACTIVE)
                    ->whereRaw('ST_CONTAINS(cityArea.polygon, POINT(CAST(driver.last_lat AS DECIMAL(10,8)), CAST(driver.last_lon AS DECIMAL(10,8))))');
                    // Nota: Ordem (latitude, longitude) mantida para consistência com o padrão do projeto
                    // Ver: CityRepository::findByCoordinate() e NeighborhoodRepository::findByCityArea()
            });
        }

        return $query;
    }
}
