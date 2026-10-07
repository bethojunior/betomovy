<?php

namespace App\Http\Controllers\User;

use App\Http\Responses\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\BlockDriverRequest;
use App\Services\User\DriverService;

class DriverController extends Controller
{
    /**
     * @var DriverService
     */
    private $service;

    public function __construct(DriverService $service)
    {
        $this->service = $service;
    }

    public function position($id)
    {
        try {
            $driver_position = $this->service
                ->findPosition($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar localização do motorista");
        }

        return ApiResponse::success($driver_position, "Localização do motorista encontrada");
    }

    public function blockDriver(BlockDriverRequest $request) {
        try {
            $driver = $this->service
                ->blockDriver($request);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao bloquear o motorista");
        }

        return ApiResponse::success($driver, "Motorista bloqueado com sucesso");
    }

    public function unblockDriver($id) {
        try {
            $driver = $this->service
                ->unblockDriver($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao desbloquear o motorista");
        }

        return ApiResponse::success($driver, "Motorista desbloqueado com sucesso");
    }
}
