<?php

namespace App\Http\Controllers\MonitoringArea;

use App\Http\Controllers\Controller;
use App\Http\Requests\MonitoringArea\MonitoringAreaRequest;
use App\Http\Responses\ApiResponse;
use App\Services\MonitoringArea\MonitoringAreaService;
use Illuminate\Http\Request;

class MonitoringAreaController extends Controller
{
    protected $service;

    public function __construct(MonitoringAreaService $service)
    {
        $this->service = $service;
    }

    public function store(MonitoringAreaRequest $request)
    {
        try {
            $monitoringArea = $this->service->store($request->validated());
        } catch (\Exception $exception) {
            return ApiResponse::error($exception, "Ocorreu um erro ao tentar inserir area de monitoramento");
        }

        return ApiResponse::created($monitoringArea, "Area de monitoramento cadastrada com sucesso");
    }

    public function findByCity(Request $request)
    {
        try {
            $results = $this->service->findAllByCity($request->header('cityId'));
        } catch (\Exception $exception) {
            return ApiResponse::error($exception, "Ocorreu um erro ao tentar listar areas de monitoramento");
        }

        return ApiResponse::success($results, "Lista de areas de monitoramento");
    }

    public function update(MonitoringAreaRequest $request, $id)
    {
        try {
            $monitoringArea = $this->service->update($id, $request->validated());
        } catch (\Exception $exception) {
            return ApiResponse::error($exception, "Ocorreu um erro ao tentar atualizar area de monitoramento");
        }

        return ApiResponse::success($monitoringArea, "Area de monitoramento atualizada com sucesso");
    }

    public function delete($id)
    {
        try {
            $this->service->delete($id);
        } catch (\Exception $exception) {
            return ApiResponse::error($exception, "Ocorreu um erro ao tentar excluir area de monitoramento");
        }

        return ApiResponse::success(null, "Area de monitoramento excluida");
    }

    public function enable($id)
    {
        try {
            $this->service->changeStatus($id, true);
        } catch (\Exception $exception) {
            return ApiResponse::error($exception, "Ocorreu um erro ao tentar atualizar status da area de monitoramento");
        }

        return ApiResponse::success(null, "Area de monitoramento atualizada");
    }

    public function disable($id)
    {
        try {
            $this->service->changeStatus($id, false);
        } catch (\Exception $exception) {
            return ApiResponse::error($exception, "Ocorreu um erro ao tentar atualizar status da area de monitoramento");
        }

        return ApiResponse::success(null, "Area de monitoramento atualizada");
    }
}


