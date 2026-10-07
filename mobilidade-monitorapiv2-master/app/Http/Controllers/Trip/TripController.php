<?php

namespace App\Http\Controllers\Trip;

use App\Http\Requests\Central\TripListRequest;
use App\Http\Requests\Trip\CancelTripRequest;
use App\Http\Requests\Trip\NewTripRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Central\Trip\CentralTripService;
use App\Services\Driver\DriverLocationService;
use App\Services\Trip\CancelTripService;
use App\Services\Trip\FinishTripService;
use App\Services\Trip\NewTripService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Trip\FinancialMirror;
use App\Services\Trip\TripService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TripController extends Controller
{
    private $service;

    public function __construct(TripService $service)
    {
        $this->service = $service;
    }

    public function findAll(Request $request)
    {
        try {
            $data = $this->service->findAll(
                $request->query->all(),
                $request->header('userid'),
                $request->header('cityid')
            );
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function findWay(string $tripReference)
    {
        try {
            $data = $this->service->findWay($tripReference);
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function findInAnalysis(Request $request):JsonResponse
    {
        try {
            $data = $this->service->findInAnalysis(
                $request->query->all(),
                $request->header('cityid')
            );
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function insert(NewTripRequest $request,
                           NewTripService $newTripService)
    {
        try {
            $trip = $newTripService
                ->newTrip($request->all(), $request->user());
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao solicitar viagem');
        }

        return ApiResponse::success($trip, "Viagem solicitada com sucesso");
    }

    public function cancel($tripReference, CancelTripRequest $request, CancelTripService $service)
    {
        try {
            $trip = $service
                ->cancel($tripReference, $request->user(), $request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao cancelar viagem');
        }

        return ApiResponse::success($trip, "Viagem cancelada com sucesso");
    }

    public function actives($centralId, TripService $service)
    {
        try {
            $trip = $service
                ->actives($centralId);
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

    public function findRideTrip($tripReference, TripService $service)
    {
        try {
            $trip = $service
                ->findRideTrip($tripReference);
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao buscar viagem');
        }

        return ApiResponse::success($trip, "Viagem encontrada");
    }

    public function driverPositions($tripReference, DriverLocationService $service)
    {
        try {
            $result = $service
                ->findByTrip($tripReference);
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao buscar localizacoes do motorista durante a viagem');
        }

        return ApiResponse::success($result);
    }

    public function finish($tripReference, FinishTripService $service): JsonResponse
    {
        try {
            $result = $service
                ->finish($tripReference);
        } catch (\Throwable $e) {
            return ApiResponse::error($e, 'Erro ao finalizar viagem');
        }

        return ApiResponse::success($result);
    }

    public function release(string $tripReference = null)
    {
        try {
            $result = $this->service->release($tripReference);
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao desbloquear viagem');
        }

        return ApiResponse::success($result);
    }

    public function findAllScheduled(Request $request)
    {
        try {
            $data = $this->service->findAllScheduled(
                $request->query->all(),
                $request->header('userid'),
                $request->header('cityid')
            );
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function getFinancialMirror(FinancialMirror $request) {
        try {
            $data = $this->service->
            getFinancialMirror($request->validated(), $request->header('cityid'));
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function findCurrentByDriver($driverId)
    {
        try {
            $data = $this->service->findCurrentByDriver($driverId);
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function findOneByCarPlate($plate)
    {
        try {
            $data = $this->service->findOneByPlate($plate);
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage());
        }

        return ApiResponse::success($data);
    }
}
