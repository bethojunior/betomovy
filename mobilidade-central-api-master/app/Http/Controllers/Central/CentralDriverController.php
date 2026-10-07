<?php

namespace App\Http\Controllers\Central;

use App\Exceptions\Central\CentralDriverException;
use App\Helpers\CityIdHelper;
use App\Http\Requests\Central\CentralDriverRequest;
use App\Http\Requests\Central\FindDriverPositionsRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Central\CentralDriverService;
use App\Http\Controllers\Controller;

class CentralDriverController extends Controller
{
    /**
     * @var CentralDriverService
     */
    private $service;

    public function __construct(CentralDriverService $service)
    {
        $this->service = $service;
    }

    public function insert(CentralDriverRequest $request)
    {
        try {
            $result = $this->service
                ->store($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error("Erro ao inserir motorista da central", [
                $e->getMessage()
            ]);
        }

        return ApiResponse::created($result, 'Motorista inserido com sucesso');
    }

    public function delete($centralId, $driverId)
    {
        try {
            $result = $this->service
                ->delete($centralId, $driverId);
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], 'Erro ao remover motorista');
        }

        return ApiResponse::success($result, "Motorista removido com sucesso");
    }

    public function positions($centralId, FindDriverPositionsRequest $request)
    {
        try {
            $cityId = CityIdHelper::parseFromRequest($request);
            $result = $this->service
                ->positions($centralId, $request->query->get('status'), $cityId);
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], 'Erro ao buscar posições dos motoristas');
        }

        return ApiResponse::success($result, "Posições dos motoristas obtidas com sucesso");
    }
}
