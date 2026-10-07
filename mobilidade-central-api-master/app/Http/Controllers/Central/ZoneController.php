<?php

namespace App\Http\Controllers\Central;

use App\Http\Requests\Central\StoreZoneRequest;
use App\Http\Requests\Central\UpdateZoneRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Central\ZoneService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ZoneController extends Controller
{
    /**
     * @var ZoneService
     */
    private $service;

    public function __construct(ZoneService $service)
    {
        $this->service = $service;
    }

    public function findZoneByCentral($centralId)
    {
        try {
            $result = $this->service
                ->findByCentral($centralId);
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], "Erro ao buscar raio de chamado");
        }

        return ApiResponse::success($result, "Raio de chamamento encontrado");
    }

    public function store($centralId, StoreZoneRequest $request)
    {
        try {
            $result = $this->service
                ->store($centralId, $request->all());
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], "Erro ao inserior raio de chamado");
        }

        return ApiResponse::created($result, "Raio de chamamento inserido");
    }

    public function update($centralId, $zoneId, UpdateZoneRequest $request)
    {
        try {
            $result = $this->service
                ->update($centralId, $zoneId, $request->all());
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], "Erro ao atualizar raio de chamado");
        }

        return ApiResponse::success($result, "Raio de chamamento atualizado");
    }
}
