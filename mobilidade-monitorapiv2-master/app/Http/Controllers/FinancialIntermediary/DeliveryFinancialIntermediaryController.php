<?php

namespace App\Http\Controllers\FinancialIntermediary;

use App\Http\Controllers\Controller;
use App\Http\Requests\FinancialIntermediary\DeliveryFinancialIntermediaryRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Acquirer\DeliveryFinancialIntermediary;
use App\Services\FinancialIntermediary\DeliveryFinancialIntermediaryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DeliveryFinancialIntermediaryController extends Controller
{
    private $service;

    public function __construct(DeliveryFinancialIntermediaryService $service)
    {
        $this->service = $service;
    }

    public function findAll(Request $request): JsonResponse
    {
        try {
            $result = $this->service->findAll($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar adquirentes");
        }

        return ApiResponse::success($result);
    }

    public function update(DeliveryFinancialIntermediary $deliveryFinancialIntermediary, DeliveryFinancialIntermediaryRequest $request): JsonResponse
    {
        try {
            $result = $this->service
                ->updateActive($deliveryFinancialIntermediary, $request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar adquirente");
        }

        return ApiResponse::success($result);
    }
}
