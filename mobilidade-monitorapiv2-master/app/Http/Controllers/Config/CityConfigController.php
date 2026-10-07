<?php

namespace App\Http\Controllers\Config;

use App\Http\Requests\Config\CityConfigRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Config\CityConfigService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CityConfigController extends Controller
{
    /**
     * @var CityConfigService
     */
    private $service;

    public function __construct(CityConfigService $service)
    {
        $this->service = $service;
    }

    public function getConfig(CityConfigRequest $request)
    {
        try {
            $result = $this->service
                ->findByLocation($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar configs");
        }

        return ApiResponse::success($result, "Configs encontradas");
    }

    public function findByCity($id)
    {
        try {
            $result = $this->service
                ->findByCity($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar configurações da cidade");
        }

        return ApiResponse::success($result);
    }

    public function update($id, CityConfigRequest $request)
    {
        try {
            $result = $this->service
                ->update($id, $request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar configurações da cidade");
        }

        return ApiResponse::success($result);
    }

    public function insert($id, CityConfigRequest $request)
    {
        try {
            $result = $this->service
                ->insert($id, $request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir configurações da cidade");
        }

        return ApiResponse::created($result);
    }
}
