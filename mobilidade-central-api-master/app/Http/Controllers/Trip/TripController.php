<?php

namespace App\Http\Controllers\Trip;

use App\Http\Controllers\Controller;
use App\Http\Requests\Central\TripListRequest;
use App\Http\Requests\Trip\ActiveTripFilterRequest;
use App\Http\Requests\Trip\CancelTripRequest;
use App\Http\Requests\Trip\NewTripRequest;
use App\Http\Requests\Trip\NewTripScheduledBatchRequest;
use App\Http\Requests\Trip\UpdateScheduledTripRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Central\Trip\CentralTripService;
use App\Services\Trip\CancelTripService;
use App\Services\Trip\DriverLocationService;
use App\Services\Trip\NewTripScheduledBatchService;
use App\Services\Trip\NewTripService;
use App\Services\Trip\TripService;
use App\Services\Trip\UpdateScheduledTripService;

class TripController extends Controller
{
    public function insert(
        NewTripRequest $request,
        NewTripService $newTripService
    ) {
        try {
            $trip = $newTripService
                ->newTrip($request->validated(), $request->user());
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao solicitar viagem');
        }

        return ApiResponse::success($trip, "Viagem solicitada com sucesso");
    }

    public function insertScheduledBatch(
        NewTripScheduledBatchRequest $request,
        NewTripScheduledBatchService $service
    ) {
        try {
            $results = $service->createBatch($request->all(), $request->user());
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao criar viagens agendadas em lote');
        }

        return ApiResponse::success($results, "Viagens agendadas processadas");
    }

    public function cancel($tripReference, CancelTripRequest $request, CancelTripService $service)
    {
        try {
            $validated = $request->validated();
            $trip = $service
                ->cancel($tripReference, $request->user(), null, $validated['scope'] ?? 'this');
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao cancelar viagem');
        }

        return ApiResponse::success($trip, "Viagem cancelada com sucesso");
    }

    public function cancelByFlow($tripReference, CancelTripService $service)
    {
        try {
            $trip = $service
                ->cancelByFlow($tripReference);
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao cancelar viagem');
        }

        return ApiResponse::success($trip, "Viagem cancelada com sucesso");
    }

    public function driverPosition($tripReference, DriverLocationService $service)
    {
        try {
            $result = $service->findDriverPositionsByTrip($tripReference);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao encontrar localizações");
        }

        return ApiResponse::success($result);
    }

    public function activeSummaries($centralId, TripService $service)
    {
        try {
            $trip = $service->findActiveSummaries($centralId);
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao buscar viagens ativas');
        }

        return ApiResponse::success($trip, "Viagens encontradas");
    }

    public function findByCentral($centralId, TripListRequest $request, CentralTripService $service)
    {
        try {
            $result = $service
                ->findByCentral($centralId, $request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar lista de viagens");
        }

        return ApiResponse::success($result, "Listagem de viagens encontradas");
    }

    public function find($tripReference, TripService $service)
    {
        try {
            $trip = $service
                ->find($tripReference);
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao buscar viagem');
        }

        return ApiResponse::success($trip, "Viagem encontrada");
    }

    public function findFee(NewTripService $newTripService)
    {
        try {
            $fee = $newTripService->findFeeTrip();
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao buscar taxa');
        }

        return ApiResponse::success($fee, "taxa encontrada com sucesso");
    }

    public function actives($centralId, ActiveTripFilterRequest $request, TripService $service)
    {
        try {
            $trip = $service->findActives($centralId, $request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao buscar viagens ativas');
        }

        return ApiResponse::success($trip, "Viagens encontradas");
    }

    public function updateScheduled(
        $tripReference,
        UpdateScheduledTripRequest $request,
        UpdateScheduledTripService $service
    ) {
        try {
            $validated = $request->validated();
            $trip = $service->update($tripReference, $validated, $validated['scope'] ?? 'this');
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao editar viagem agendada');
        }

        return ApiResponse::success($trip, "Viagem agendada atualizada com sucesso");
    }
}
