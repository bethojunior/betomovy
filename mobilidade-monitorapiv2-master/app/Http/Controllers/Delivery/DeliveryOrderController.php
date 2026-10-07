<?php

namespace App\Http\Controllers\Delivery;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\Delivery\DeliveryOrderService;

class DeliveryOrderController extends Controller
{
    private $service;

    public function __construct(DeliveryOrderService $service)
    {
        $this->service = $service;
    }

    public function actives($cityId)
    {
        try {
            $results = $this->service->actives($cityId);
        }catch (\Exception $exception){
            return ApiResponse::error($exception,"Ocorreu um erro ao buscar pedidos ativos");
        }

        return ApiResponse::success($results,"Lista de pedidos ativos");
    }
}
