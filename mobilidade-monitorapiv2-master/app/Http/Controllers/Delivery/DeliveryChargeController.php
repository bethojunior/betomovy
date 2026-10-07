<?php

namespace App\Http\Controllers\Delivery;

use App\Http\Controllers\Controller;
use App\Http\Requests\Delivery\DeliveryChargeRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Delivery\DeliveryChargeService;
use Illuminate\Http\Request;

class DeliveryChargeController extends Controller
{
    /**
     * @var DeliveryChargeService
     */
    private $service;

    public function __construct(DeliveryChargeService $service)
    {
        $this->service = $service;
    }

    public function find()
    {
        try {
            $result = $this->service->findUnique();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar perfil de cobrança de delivery");
        }

        return ApiResponse::success($result);
    }

    public function updateOrCreate(DeliveryChargeRequest $request)
    {
        try {
            $result = $this->service
                ->updateOrCreate($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar perfil de cobrança");
        }

        return ApiResponse::success($result);
    }
}
