<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/08/2020
 * Time: 17:22
 */

namespace Delivery\Http\Controllers\Order;


use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Delivery\Http\Requests\Order\SendMessageRequest;
use Delivery\Models\Order\DeliveryOrder;
use Delivery\Services\Order\DeliveryOrderMessageService;
use Illuminate\Http\Request;

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

    public function findAll(DeliveryOrder $deliveryOrder, Request $request)
    {
        try {
            $result = $this->service->findMessages($deliveryOrder,$request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar mensagens");
        }

        return ApiResponse::success($result);
    }

    public function send(DeliveryOrder $deliveryOrder, SendMessageRequest $request)
    {
        try {
            $result = $this->service->send($deliveryOrder, $request->validated(), $request->user());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao enviar mensagem");
        }

        return ApiResponse::success($result);
    }
}
