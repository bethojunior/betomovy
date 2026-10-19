<?php

namespace App\Http\Controllers\Central;

use App\Http\Requests\Central\CalculatePriceRequest;
use App\Http\Requests\Central\DeletePriceRequest;
use App\Http\Requests\Central\StorePriceRequest;
use App\Http\Requests\Central\UpdatePriceRequest;
use App\Http\Requests\Central\UpdateOrderPriceRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Central\Price\CalculatePriceService;
use App\Services\Central\Price\PriceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PriceController extends Controller
{
    private $service;

    public function __construct(PriceService $service)
    {
        $this->service = $service;
    }

    public function findAll(Request $request): JsonResponse
    {
        try {
            $rawCityId = $request->header('cityid') ?? $request->header('cityId') ?? $request->query('cityId') ?? $request->get('cityId');
            $cityId = (is_numeric($rawCityId) && (int)$rawCityId > 0) ? (int)$rawCityId : null;
            
            $query = $request->query->all();
            if (isset($query['cityId'])) {
                if (is_numeric($query['cityId']) && (int)$query['cityId'] > 0) {
                    $query['cityId'] = (int)$query['cityId'];
                } else {
                    unset($query['cityId']);
                }
            }

            $data = $this->service->findAll($query, $cityId);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar preços");
        }

        return ApiResponse::success($data, "Preços encontrados");
    }

    public function store(StorePriceRequest $request): JsonResponse
    {
        try {
            $result = $this->service->store($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], "Erro ao armazenar preço");
        }

        return ApiResponse::created($result, "Preço criado com sucesso");
    }

    public function findAllCentralPrices($central_id)
    {
        try {
            $result = $this->service
                ->findByCentral($central_id);
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], "Erro ao buscar preços da central");
        }

        return ApiResponse::success($result, "Preços da central encontrados");
    }

    public function update($price_id, UpdatePriceRequest $request)
    {
        try {
            $result = $this->service
                ->update($price_id, $request->all());
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], "Erro ao atualizar preço da central");
        }

        return ApiResponse::success($result, "Preço da central atualizado com sucesso");
    }

    public function delete($price_id, DeletePriceRequest $request)
    {
        try {
            $result = $this->service
                ->delete($price_id);
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], "Erro ao remover preço da central");
        }

        return ApiResponse::success($result, "Preço removido com sucesso");
    }

    public function calculate($central_id, CalculatePriceRequest $request, CalculatePriceService $service)
    {
        try {
            $result = $service
                ->getPrices($central_id, $request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], "Erro ao calcular preço da viagem");
        }

        return ApiResponse::success($result, "Preços calculados");
    }

    public function updateOrder(UpdateOrderPriceRequest $request): JsonResponse
    {
        try {
            $result = $this->service->updateOrder(
                $request->validated()['cityId'],
                $request->validated()['orders']
            );
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], "Erro ao atualizar ordem dos preços");
        }

        return ApiResponse::success($result, "Ordem dos preços atualizada com sucesso");
    }
}
