<?php

namespace App\Http\Controllers\Config;

use App\Http\Requests\Config\StoreZoneRequest;
use App\Http\Requests\Config\UpdateZoneRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Config\ZoneService;
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

    public function findByCity($cityId)
    {
        try {
            $result = $this->service
                ->findByCity($cityId);
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], "Erro ao buscar raio de chamado");
        }

        return ApiResponse::success($result, "Raio de chamamento encontrado");
    }

    public function store($cityId, StoreZoneRequest $request)
    {
        try {
            $result = $this->service
                ->store($cityId, $request->all());
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], "Erro ao inserior raio de chamado");
        }

        return ApiResponse::created($result, "Raio de chamamento inserido");
    }

    public function update($cityId, $zoneId, UpdateZoneRequest $request)
    {
        try {
            $result = $this->service
                ->update($cityId, $zoneId, $request->all());
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], "Erro ao atualizar raio de chamado");
        }

        return ApiResponse::success($result, "Raio de chamamento atualizado");
    }
}
