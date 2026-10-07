<?php

namespace App\Http\Controllers\Trip\ChatTrip;

use App\Http\Requests\Trip\ChatTrip\StoreMessageChatTripRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Trip\ChatTrip\ChatTripService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ChatTripController extends Controller
{
    /**
     * @var ChatTripService
     */
    private $service;

    public function __construct(ChatTripService $service)
    {
        $this->service = $service;
    }

    public function sendMessage(StoreMessageChatTripRequest $request)
    {
        try {
            $result = $this->service
                ->sendMessage($request->all(), $request->user());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao enviar mensagem");
        }

        return ApiResponse::success($result, "Mensagem enviada com sucesso");
    }
}
