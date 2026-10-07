<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/07/2020
 * Time: 18:09
 */

namespace Delivery\Http\Controllers\Order;


use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Delivery\Services\Order\DeliveryOrderListService;
use Illuminate\Http\Request;

class DeliveryOrderListController extends Controller
{
    /**
     * @var DeliveryOrderListService
     */
    private $service;

    public function __construct(DeliveryOrderListService $service)
    {
        $this->service = $service;
    }

    public function listByCustomer(Request $request)
    {
        try {
            $result = $this->service
                ->findByCustomer($request->user(), $request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar pedidos de um cliente");
        }

        return ApiResponse::success($result);
    }

    public function listByDriver(Request $request)
    {
        try {
            $result = $this->service
                ->findByDriver($request->user(), $request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar pedidos de um motorista");
        }

        return ApiResponse::success($result);
    }
}
