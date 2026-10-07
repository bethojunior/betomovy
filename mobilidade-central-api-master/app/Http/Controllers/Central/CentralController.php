<?php

namespace App\Http\Controllers\Central;

use App\Http\Requests\Central\StoreCentralRequest;
use App\Http\Requests\Central\UpdateFavoriteDriverRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Central\Central;
use App\Services\Central\CentralService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CentralController extends Controller
{
    /**
     * @var CentralService
     */
    private $service;

    public function __construct(CentralService $service)
    {
        $this->service = $service;
    }

    public function find($id)
    {
        try {
            $result = $this->service
                ->find($id);
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], 'Erro ao buscar central');
        }

        return ApiResponse::success($result, 'Central Encontrada');
    }

    public function findByResponsible($id){
        try {
            $result = $this->service
                ->findByResponsible($id);
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], 'Erro ao buscar central', 404);
        }

        return ApiResponse::success($result, 'Central Encontrada');
    }

    public function register(StoreCentralRequest $request)
    {
        try {
            $result = $this->service
                ->store($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao registrar central");
        }

        return ApiResponse::created($result);
    }

    public function getDrivers($centralId)
    {
        try {
            $result = $this->service
                ->findDrivers($centralId);
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], 'Erro ao buscar motoristas da central');
        }

        return ApiResponse::success($result, 'Motoristas encontrados');
    }

    public function getDriversActive($centralId, \Illuminate\Http\Request $request)
    {
        try {
            $filter = $request->query('filter');
            $result = $this->service->findDriversActives($centralId, $filter);
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], 'Erro ao buscar motoristas ativos da central');
        }

        return ApiResponse::success($result, 'Motoristas encontrados');
    }

    public function updateFavorite(UpdateFavoriteDriverRequest $request)
    {
        try {
            $this->service->favoriteDriver($request, $request->user());
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], 'Erro ao atualizar motorista');
        }

        return ApiResponse::success(true, 'Motorista atualizado com sucesso');
    }

    public function getCustomers(Central $central, Request $request)
    {
        try {
            $result = $this->service
                ->findCustomers($central, $request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], 'Erro ao buscar clientes da central');
        }

        return ApiResponse::success($result, 'Clientes encontrados');
    }

    public function findAllCentralCallTypes()
    {
        try {
            $data = $this->service->findAllCentralCallTypes();
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function getDiscountConfigs(int $centralId)
    {
        try {
            $data = $this->service->getDiscountConfigs($centralId);
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

}
