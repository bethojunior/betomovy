<?php

namespace Delivery\Http\Controllers\Order;

use App\Constants\Delivery\DeliveryOrderStatusConst;
use App\Http\Controllers\Controller;
use Delivery\Http\Requests\Order\AcceptOrderRequest;
use Delivery\Http\Requests\Order\NewOrderRequest;
use App\Http\Responses\ApiResponse;
use Delivery\Http\Requests\Order\StepOrderRequest;
use Delivery\Models\Order\DeliveryOrder;
use Delivery\Services\Order\DeliveryOrderService;
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

    public function make(NewOrderRequest $request)
    {
        try {
            $result = $this->service
                ->make($request->validated(), $request->user());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao fazer o pedido");
        }

        return ApiResponse::created($result);
    }

    public function accept(DeliveryOrder $deliveryOrder, AcceptOrderRequest $request)
    {
        try {
            $result = $this->service
                ->accept($deliveryOrder, $request->user());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao aceitar pedido");
        }

        return ApiResponse::success($result);
    }

    public function refuse(DeliveryOrder $deliveryOrder, StepOrderRequest $request)
    {
        try {
            $result = $this->service
                ->refuse($deliveryOrder, $request->user());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao recusar pedido");
        }

        return ApiResponse::success($result);
    }

    public function informArrival(DeliveryOrder $deliveryOrder, StepOrderRequest $request)
    {
        try {
            $result = $this->service
                ->updateStatus($deliveryOrder, DeliveryOrderStatusConst::WITHDRAWING_ORDER);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao sinalizar retirada do pedido");
        }

        return ApiResponse::success($result);
    }

    public function goOutForDelivery(DeliveryOrder $deliveryOrder, StepOrderRequest $request)
    {
        try {
            $result = $this->service
                ->updateStatus($deliveryOrder, DeliveryOrderStatusConst::OUT_FOR_DELIVERY);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao sair para entrega");
        }

        return ApiResponse::success($result);
    }

    public function arriveOnDelivery(DeliveryOrder $deliveryOrder, StepOrderRequest $request)
    {
        try {
            $result = $this->service
                ->updateStatus($deliveryOrder, DeliveryOrderStatusConst::ARRIVED);
        } catch (\Exception $e) {
            return ApiResponse::error($e,"Erro ao informar chegada do local de entrega");
        }

        return ApiResponse::success($result);
    }

    public function deliver(DeliveryOrder $deliveryOrder, StepOrderRequest $request)
    {
        try {
            $result = $this->service
                ->updateStatus($deliveryOrder, DeliveryOrderStatusConst::DELIVERED);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao sinalizar entrega");
        }

        return ApiResponse::success($result);
    }

    public function return(DeliveryOrder $deliveryOrder, StepOrderRequest $request)
    {
        try {
            $result = $this->service
                ->updateStatus($deliveryOrder, DeliveryOrderStatusConst::RETURNING);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao sinalizar retorno ao estabelecimento");
        }

        return ApiResponse::success($result);
    }

    public function finish(DeliveryOrder $deliveryOrder, StepOrderRequest $request)
    {
        try {
            $result = $this->service
                ->finish($deliveryOrder);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao finalizar pedido");
        }

        return ApiResponse::success($result);
    }

    public function show($id)
    {
        try {
            $result = $this->service->find($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar pedido");
        }

        return ApiResponse::success($result);
    }

    public function findByCustomer(Request $request)
    {
        try {
            $result = $this->service
                ->findActivesByCustomer($request->user());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar pedidos ativos do cliente");
        }

        return ApiResponse::success($result);
    }

    public function findByDriver(Request $request)
    {
        try {
            $result = $this->service
                ->findActivesByDriver($request->user());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar pedidos ativos do entregador");
        }

        return ApiResponse::success($result);
    }
}
