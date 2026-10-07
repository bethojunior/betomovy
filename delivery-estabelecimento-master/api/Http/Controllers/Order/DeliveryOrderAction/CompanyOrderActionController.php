<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 18/06/2020
 * Time: 08:48
 */

namespace Api\Http\Controllers\Order\DeliveryOrderAction;


use Api\Http\Requests\Order\RefuseOrderRequest;
use Api\Http\Responses\ApiResponse;
use Api\Services\Order\DeliveryOrderAction\CompanyOrderActionService;
use App\Http\Controllers\Controller;
use Common\Models\Order\DeliveryOrder;

class CompanyOrderActionController extends Controller
{
    /**
     * @var CompanyOrderActionService
     */
    private $service;

    public function __construct(CompanyOrderActionService $service)
    {
        $this->service = $service;
    }

    /**
     * @param DeliveryOrder $deliveryOrder
     * @return \Illuminate\Http\JsonResponse
     * @throws \Throwable
     */
    public function confirm(DeliveryOrder $deliveryOrder)
    {
        try {
            $result = $this->service
                ->confirm($deliveryOrder);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao confirmar Pedido");
        }

        return ApiResponse::success($result);
    }

    /**
     * @param DeliveryOrder $deliveryOrder
     * @param RefuseOrderRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function refuse(DeliveryOrder $deliveryOrder, RefuseOrderRequest $request)
    {
        try {
            $result = $this->service
                ->refuse($deliveryOrder);
        } catch (\Throwable $e) {
            return ApiResponse::error($e, "Erro ao recusar pedido");
        }

        return ApiResponse::success($result);
    }

    public function cancel(DeliveryOrder $deliveryOrder)
    {
        try {
            $result = $this->service
                ->cancel($deliveryOrder);
        } catch (\Throwable $e) {
            return ApiResponse::error($e, "Erro ao cancelar pedido");
        }

        return ApiResponse::success($result);
    }

    /**
     * @param DeliveryOrder $deliveryOrder
     * @return \Illuminate\Http\JsonResponse
     * @throws \Throwable
     */
    public function prepare(DeliveryOrder $deliveryOrder)
    {
        try {
            $result = $this->service
                ->prepare($deliveryOrder);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao colocar o Pedido em preparação");
        }

        return ApiResponse::success($result);
    }

    /**
     * @param DeliveryOrder $deliveryOrder
     * @return \Illuminate\Http\JsonResponse
     */
    public function searchDeliveryMan(DeliveryOrder $deliveryOrder)
    {
        try {
            $result = $this->service
                ->searchDeliveryMan($deliveryOrder);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar entregadores");
        }

        return ApiResponse::success($result);
    }


    public function goOutForDelivery(DeliveryOrder $deliveryOrder, int $driverId)
    {
        try {
            $result = $this->service
                ->goOutForDelivery($deliveryOrder, $driverId);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao vincular o entregador");
        }

        return ApiResponse::success($result);
    }


    public function goOutForDeliveryManual(DeliveryOrder $deliveryOrder)
    {
        try {
            $result = $this->service
                ->goOutForDeliveryManual($deliveryOrder);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao vincular o entregador");
        }

        return ApiResponse::success($result);
    }


    public function withdrawInLocal(DeliveryOrder $deliveryOrder)
    {
        try {
            $result = $this->service
                ->withdrawInLocal($deliveryOrder);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao disponibilizar pedido para retirada");
        }

        return ApiResponse::success($result);
    }

    public function finish(DeliveryOrder $deliveryOrder)
    {
        try {
            $result = $this->service
                ->finish($deliveryOrder);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao finalizar pedido");
        }

        return ApiResponse::success($result);
    }
}
