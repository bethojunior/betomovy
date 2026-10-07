<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Responses\ApiResponse;
use App\Repositories\Dashboard\CalculatedTripPriceRepository;
use App\Services\Dashboard\DashboardService;
use App\Services\QueueInsert\QueueInsertSyncService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\Dashboard\DashboardRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use App\Services\Trip\TripService;
use App\Services\Trip\EstimatedArrivalCalculator;
use App\Http\Requests\Dashboard\TripsByStatusRequest;

class DashboardController extends Controller
{
    private $repository;
    private $service;
    private $tripService;
    private $calculatedTripPriceRepository;
    private $queueInsertSyncService;

    public function __construct(
        DashboardRepository $repository,
        DashboardService $service,
        TripService $tripService,
        CalculatedTripPriceRepository $calculatedTripPriceRepository,
        QueueInsertSyncService $queueInsertSyncService
    ) {
        $this->repository = $repository;
        $this->service = $service;
        $this->tripService = $tripService;
        $this->calculatedTripPriceRepository = $calculatedTripPriceRepository;
        $this->queueInsertSyncService = $queueInsertSyncService;
    }

    public function all(Request $request)
    {
        try {
            $cityId = $request->header('cityid');
            $queryParams = $request->query->all();
            $cacheKey = 'ranking_all_' . $cityId;

            $forceCache = filter_var($request->query('forceCache'), FILTER_VALIDATE_BOOLEAN);

            if ($forceCache) {
                Cache::forget($cacheKey);
            }

            $data = Cache::remember($cacheKey, 7200, function () use ($queryParams, $cityId) {
                $rankingCustomer = $this->repository->rankingCustomer($queryParams, $cityId);
                $rankingDriver = $this->repository->rankingDriver($queryParams, $cityId);
                $statisticsByCity = $this->service->statisticsByCityToday($cityId);
                $currentQuantities = $this->service->currentQuantities($cityId);
                $totalBilled = $this->tripService->totalBilled($cityId);

                return [
                    'rankingCustomer' => $rankingCustomer,
                    'rankingDriver' => $rankingDriver,
                    'statisticsByCity' => $statisticsByCity,
                    'currentQuantities' => $currentQuantities,
                    'totalBilled' => $totalBilled,
                ];
            });
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }


    public function quantityTripsByStatus(Request $request)
    {
        try {
            $data = $this->repository->quantityTripsByStatus($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function quantityTripsCanceledByUser(Request $request)
    {
        try {
            $data = $this->repository->quantityTripsCanceledByUser($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function totalBillingByPaymentForm(Request $request)
    {
        try {
            $data = $this->repository->totalBillingByPaymentForm($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function averageTicketValue(Request $request)
    {
        try {
            $data = $this->repository->averageTicketValue($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function rankingDriver(Request $request)
    {
        try {
            $data = $this->repository->rankingDriver(
                $request->query->all(),
                $request->header('cityid')
            );
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function rankingDriverAll(Request $request)
    {
        try {
            $data = $this->repository->rankingDriverAll(
                $request->query->all()
            );
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function rankingCustomer(Request $request)
    {
        try {
            $data = $this->repository->rankingCustomer(
                $request->query->all(),
                $request->header('cityid')
            );
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function rankingCustomerAll(Request $request)
    {
        try {
            $data = $this->repository->rankingCustomerAll(
                $request->query->all()
            );
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function quantityDriversTotal(Request $request)
    {
        try {
            $data = $this->repository->quantityDriversTotal($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function quantityDriversActive(Request $request)
    {
        try {
            $data = $this->repository->quantityDriversActive($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function quantityCustomersTotal(Request $request)
    {
        try {
            $data = $this->repository->quantityCustomersTotal($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function quantityCustomersActive(Request $request)
    {
        try {
            $data = $this->repository->quantityCustomersActive($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function rankingCallType(Request $request)
    {
        try {
            $data = $this->repository->rankingCallType($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function rankingNeighborhood(Request $request)
    {
        try {
            $data = $this->repository->rankingNeighborhood($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function rankingHorary(Request $request)
    {
        try {
            $data = $this->repository->rankingHorary($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function lastDynamicsPlaces(Request $request)
    {
        try {
            $data = $this->repository->lastDynamicsPlaces($request->query->all(), $request->header('cityid'));
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function expensiveDynamicsPlaces(Request $request)
    {
        try {
            $data = $this->repository->expensiveDynamicsPlaces($request->query->all(), $request->header('cityid'));
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function placesMoreTripsDayAgo(Request $request)
    {
        try {
            $data = $this->repository->placesMoreTripsDayAgo($request->query->all(), $request->header('cityid'));
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function placesMoreTripsWeekAgo(Request $request)
    {
        try {
            $data = $this->repository->placesMoreTripsWeekAgo($request->query->all(), $request->header('cityid'));
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function tripQuantities(Request $request)
    {
        try {
            $data = $this->repository->tripQuantities($request->header('userid'), $request->query('date'), $request->header('cityid'));
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function abandonedTrips(Request $request): JsonResponse
    {
        try {
            $minutes = (int) $request->query('minutes', 15);
            $cityId = $request->header('cityid');
            $result = $this->calculatedTripPriceRepository->getAbandonedTrips(
                $minutes,
                $cityId ? (int) $cityId : null
            );
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar simulações abandonadas");
        }

        return ApiResponse::success($result, "Simulações processadas");
    }

    public function syncQueueInsert(): JsonResponse
    {
        try {
            $result = $this->queueInsertSyncService->sync();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao sincronizar a fila");
        }

        return ApiResponse::success($result, "Sincronização executada");
    }

    public function activeTrips(Request $request): JsonResponse
    {
        $cityId = $request->header('cityid');
        $filters = $request->only(['customerName', 'driverName', 'status', 'excludeScheduled', 'tripReference', 'page', 'perPage']);

        try {
            $cacheKey = 'monitor.activeTrips.' . $cityId . '.' . md5(json_encode($filters));

            $data = Cache::remember($cacheKey, 5, function () use ($cityId, $filters) {
                return $this->repository->activeTrips($cityId, $filters);
            });

            $data['data'] = array_map(function ($trip) {
                if (is_array($trip)) {
                    $trip = (object) $trip;
                }
                $trip->tripProgress = \App\Services\Trip\TripProgressCalculator::calculate($trip);
                $estimatedArrivalMinutes = EstimatedArrivalCalculator::calculate($trip);
                $trip->estimatedArrivalTime = EstimatedArrivalCalculator::formatDuration($estimatedArrivalMinutes);
                $trip->estimatedArrivalMinutes = $estimatedArrivalMinutes;
                return $trip;
            }, $data['data']);

        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar as viagens ativas");
        }

        return ApiResponse::success($data, "Viagens ativas encontradas");
    }

    public function activeTripDetail(string $tripReference): JsonResponse
    {
        try {
            $trip = $this->repository->findActiveTripDetail($tripReference);

            if (!$trip) {
                return ApiResponse::error(null, "Viagem não encontrada ou não está mais ativa", 404);
            }

            $trip = (object) $trip;
            $trip->tripProgress = \App\Services\Trip\TripProgressCalculator::calculate($trip);
            $estimatedArrivalMinutes = EstimatedArrivalCalculator::calculate($trip);
            $trip->estimatedArrivalTime = EstimatedArrivalCalculator::formatDuration($estimatedArrivalMinutes);
            $trip->estimatedArrivalMinutes = $estimatedArrivalMinutes;
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar detalhes da viagem");
        }

        return ApiResponse::success($trip, "Viagem encontrada");
    }

    public function currentQuantities(Request $request): JsonResponse
    {
        try {
            $data = $this->service->currentQuantities($request->header('cityid'));
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar as quantidades atuais");
        }

        return ApiResponse::success($data, "Quantidades atuais calculadas");
    }

    public function currentQuantitiesAll()
    {
        try {
            $data = $this->service->currentQuantitiesAll();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar as quantidades atuais");
        }

        return ApiResponse::success($data, "Quantidades atuais calculadas");
    }

    public function statisticsByCity(Request $request) {
        try {
            $data = $this->service->statisticsByCity($request->header('cityid'));
        } catch(\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar as estatísticas atuais");
        }

        return ApiResponse::success($data, "Quantidades atuais calculadas");
    }

    public function statisticsAll() {
        try {
            $data = $this->service->statisticsAll();
        } catch(\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar as estatísticas atuais");
        }

        return ApiResponse::success($data, "Quantidades atuais calculadas");
    }

    public function driverAndCustomersActivesByCity(Request $request) {
        try {
            $data = $this->service->driverAndCustomersActivesByCity($request->header('cityid'));
        } catch(\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar as estatísticas atuais");
        }

        return ApiResponse::success($data, "Quantidades atuais calculadas");
    }

    public function getTripsByStatus(TripsByStatusRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $status = $validated['status'];
            $canceledBy = $validated['canceledBy'] ?? null;
            /** @var string|null $dateStart */
            $dateStart = $validated['dateStart'] ?? null;
            /** @var string|null $dateEnd */
            $dateEnd = $validated['dateEnd'] ?? null;
            /** @var string|null $date */
            // Se não tiver intervalo de datas, usa date (ou data atual como padrão)
            $date = $validated['date'] ?? (empty($dateStart) && empty($dateEnd) ? Carbon::now()->toDateString() : null);
            $cityId = $request->header('cityid') ? (int)$request->header('cityid') : null;

            $data = $this->repository->getTripsByStatus($status, $cityId, $canceledBy, $date, $dateStart, $dateEnd);
        } catch (\Exception $e) {
            Log::error('Erro ao buscar viagens por status: ' . $e->getMessage(), [
                'status' => $status ?? null,
                'canceledBy' => $canceledBy ?? null,
                'date' => $date ?? null,
                'dateStart' => $dateStart ?? null,
                'dateEnd' => $dateEnd ?? null,
                'cityId' => $cityId ?? null
            ]);
            return ApiResponse::error(null, "Erro ao buscar viagens por status", 500);
        }

        return ApiResponse::success($data);
    }

    public function getActiveCustomersLast10Minutes(Request $request): JsonResponse
    {
        try {
            $cityId = $request->header('cityid') ? (int)$request->header('cityid') : null;
            
            Log::info('Buscando clientes ativos', [
                'cityId' => $cityId,
                'cityId_header' => $request->header('cityid')
            ]);
            
            $data = $this->repository->getActiveCustomersLast10Minutes($cityId);
            
            Log::info('Clientes encontrados', [
                'count' => count($data),
                'cityId' => $cityId
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao buscar clientes ativos nos últimos 10 minutos: ' . $e->getMessage(), [
                'cityId' => $cityId ?? null,
                'trace' => $e->getTraceAsString()
            ]);
            return ApiResponse::error(null, "Erro ao buscar clientes ativos", 500);
        }

        return ApiResponse::success($data, "Clientes ativos encontrados");
    }

        public function getActiveCustomersAllTime(Request $request): JsonResponse
    {
        try {
            $cityId = $request->header('cityid') ? (int)$request->header('cityid') : null;
            
            Log::info('Buscando clientes ativos', [
                'cityId' => $cityId,
                'cityId_header' => $request->header('cityid')
            ]);
            
            $data = $this->repository->getActiveCustomersAllTime($cityId);
            
            Log::info('Clientes encontrados', [
                'count' => count($data),
                'cityId' => $cityId
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao buscar clientes: ' . $e->getMessage(), [
                'cityId' => $cityId ?? null,
                'trace' => $e->getTraceAsString()
            ]);
            return ApiResponse::error(null, "Erro ao buscar clientes ativos", 500);
        }

        return ApiResponse::success($data, "Clientes ativos encontrados");
    }
    
}
