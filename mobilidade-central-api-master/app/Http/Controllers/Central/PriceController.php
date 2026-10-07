<?php

namespace App\Http\Controllers\Central;

use App\Http\Requests\Central\CalculatePriceRequest;
use App\Http\Requests\Central\DeletePriceRequest;
use App\Http\Requests\Central\StorePriceRequest;
use App\Http\Requests\Central\UpdatePriceRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Central\Price\CalculatePriceService;
use App\Services\Central\Price\PriceService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PriceController extends Controller
{
    /**
     * @var PriceService
     */
    private $service;

    public function __construct(PriceService $service)
    {
        $this->service = $service;
    }

    public function store(StorePriceRequest $request)
    {
        try {
            $result = $this->service
                ->store($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], "Erro ao armazenar preço da central");
        }

        return ApiResponse::created($result, "Preço da central criado com sucesso");
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

        return ApiResponse::success($result, "Preço da central removido com sucesso");
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


    public function calculateByNeighborhood($central_id, CalculatePriceRequest $request, CalculatePriceService $service)
    {
        try {
            $result = $service
                ->getPricesByNeighborhood($central_id, $request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], "Erro ao calcular preço da viagem");
        }

        return ApiResponse::success($result, "Preços calculados");
    }
}
