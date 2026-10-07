<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 15/07/2020
 * Time: 08:31
 */

namespace Delivery\Http\Controllers\Order;


use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Delivery\Http\Requests\Order\CancelOrderByCustomerRequest;
use Delivery\Http\Requests\Order\CancelOrderByDriverRequest;
use Delivery\Models\Order\DeliveryOrder;
use Delivery\Services\Order\CancelDeliveryOrderService;
use Illuminate\Http\Request;

class CancelDeliveryOrderController extends Controller
{
    /**
     * @var CancelDeliveryOrderService
     */
    private $service;

    public function __construct(CancelDeliveryOrderService $service)
    {
        $this->service = $service;
    }

    public function cancelByCustomer(DeliveryOrder $deliveryOrder, CancelOrderByCustomerRequest $request)
    {
        try {
            $result = $this->service
                ->cancelByCustomer($deliveryOrder);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao cancelar viagem");
        }

        return ApiResponse::success($result);
    }


    public function cancelByDriver(DeliveryOrder $deliveryOrder, CancelOrderByDriverRequest $request)
    {
        try {
            $result = $this->service
                ->cancelByDriver($deliveryOrder);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao cancelar viagem");
        }

        return ApiResponse::success($result);
    }
}
