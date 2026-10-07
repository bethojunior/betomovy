<?php

namespace App\Http\Controllers\Trip\ChatTrip;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\Trip\ChatTrip\MessagesChatTripService;

class MessagesChatTripController extends Controller
{
    /**
     * @var MessagesChatTripService
     */
    private $service;

    public function __construct(MessagesChatTripService $service)
    {
        $this->service = $service;
    }

    public function findByTrip(string $tripReference)
    {
        $result = $this->service->getMessagesByTrip($tripReference);

        return ApiResponse::success($result, "Mensagens encontradas");
    }
}
