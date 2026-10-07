<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 03/08/2020
 * Time: 15:36
 */

namespace Api\Http\Controllers\Order;


use Api\Http\Requests\Order\SendMessageRequest;
use Api\Http\Responses\ApiResponse;
use Api\Services\Order\DeliveryOrderMessageService;
use App\Http\Controllers\Controller;
use Common\Models\Order\DeliveryOrder;

class DeliveryOrderMessageController extends Controller
{
    /**
     * @var DeliveryOrderMessageService
     */
    private $service;

    public function __construct(DeliveryOrderMessageService $service)
    {
        $this->service = $service;
    }

    public function sendMessage(DeliveryOrder $deliveryOrder, SendMessageRequest $request)
    {
        try {
            $result = $this->service
                ->sendMessage($deliveryOrder, $request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao enviar mensagem");
        }

        return ApiResponse::success($result);
    }

    public function findAll(DeliveryOrder $deliveryOrder)
    {
        try {
            $result = $this->service->findMessages($deliveryOrder);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar mensagens");
        }

        return ApiResponse::success($result);
    }
}
