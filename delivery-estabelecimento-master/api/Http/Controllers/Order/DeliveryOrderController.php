<?php

namespace Api\Http\Controllers\Order;

use Api\Http\Responses\ApiResponse;
use Api\Services\Order\DeliveryOrderService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DeliveryOrderController extends Controller
{
    /**
     * @var DeliveryOrderService
     */
    private $service;

    public function __construct(DeliveryOrderService $service)
    {
        $this->service = $service;
    }

    public function findActives()
    {
        try {
            $result = $this->service
                ->findActiveOrders();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar os pedidos");
        }

        return ApiResponse::success($result);
    }

    public function findOrderById($id)
    {
        try {
            $result = $this->service
                ->findOrderById($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar os pedidos");
        }

        return ApiResponse::success($result);
    }


    public function findAll(Request $request)
    {
        try {
            $result = $this->service
                ->findAll($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar os pedidos");
        }

        return ApiResponse::success($result);
    }
}
