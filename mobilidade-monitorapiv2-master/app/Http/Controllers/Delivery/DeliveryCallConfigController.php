<?php

namespace App\Http\Controllers\Delivery;

use App\Http\Controllers\Controller;
use App\Http\Requests\Delivery\DeliveryCallConfigRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Delivery\DeliveryCallConfig;
use App\Services\Delivery\DeliveryCallConfigService;
use Illuminate\Http\Request;

class DeliveryCallConfigController extends Controller
{
    /**
     * @var DeliveryCallConfigService
     */
    private $service;

    public function __construct(DeliveryCallConfigService $service)
    {
        $this->service = $service;
    }

    public function findAll()
    {
        try {
            $result = $this->service->findAll();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar configurações de chamado de delivery");
        }

        return ApiResponse::success($result);
    }

    public function update(DeliveryCallConfig $deliveryCallConfig, DeliveryCallConfigRequest $request)
    {
        try {
            $result = $this->service
                ->update($deliveryCallConfig, $request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar configuração");
        }

        return ApiResponse::success($result);
    }
}
