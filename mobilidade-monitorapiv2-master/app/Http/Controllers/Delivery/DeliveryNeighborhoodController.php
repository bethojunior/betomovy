<?php

namespace App\Http\Controllers\Delivery;

use App\Http\Controllers\Controller;
use App\Http\Requests\Delivery\DeliveryNeighborhoodRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Delivery\DeliveryNeighborhood;
use App\Services\Delivery\DeliveryNeighborhoodService;
use Illuminate\Http\Request;

class DeliveryNeighborhoodController extends Controller
{
    /**
     * @var DeliveryNeighborhoodService
     */
    private $service;

    public function __construct(DeliveryNeighborhoodService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        try {
            $result = $this->service
                ->findAll($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao buscar os bairros');
        }

        return ApiResponse::success($result);
    }

    public function store(DeliveryNeighborhoodRequest $request)
    {
        try {
            $result = $this->service
                ->store($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir bairro");
        }

        return ApiResponse::created($result);
    }

    public function update(DeliveryNeighborhood $deliveryNeighborhood, DeliveryNeighborhoodRequest $request)
    {
        try {
            $result = $this->service
                ->update($request->validated(), $deliveryNeighborhood);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar bairro");
        }

        return ApiResponse::success($result);
    }

    public function delete(DeliveryNeighborhood $deliveryNeighborhood)
    {
        try {
            $result = $this->service
                ->delete($deliveryNeighborhood);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao excluir bairro");
        }

        return ApiResponse::success($result);
    }
}
