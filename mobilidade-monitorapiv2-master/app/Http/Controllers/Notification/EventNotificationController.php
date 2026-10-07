<?php

namespace App\Http\Controllers\Notification;

use App\Http\Controllers\Controller;
use App\Http\Requests\Notification\EventNotificationRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Notification\EventNotificationService;
use App\Services\Notification\EventNotificationTypeService;

class EventNotificationController extends Controller
{
    private $eventNotificationTypeService;
    private $eventNotificationService;

    public function __construct(
        EventNotificationService $eventNotificationService,
        EventNotificationTypeService $eventNotificationTypeService
    )
    {
        $this->eventNotificationService = $eventNotificationService;
        $this->eventNotificationTypeService = $eventNotificationTypeService;
    }

    public function findTypes()
    {
        try {
            $result = $this->eventNotificationTypeService->findAll();
        } catch (\Exception $exception){
            return ApiResponse::error($exception);
        }

        return ApiResponse::success($result, "Tipos de notificação de evento");
    }

    public function store(EventNotificationRequest $request)
    {
        try {
            $result = $this->eventNotificationService->insert($request->validated());
        } catch (\Exception $exception){
            return ApiResponse::error($exception);
        }

        return ApiResponse::success($result, "Notificação criada com sucesso");
    }

    public function findAll()
    {
        try {
            $result = $this->eventNotificationService->findAll();
        } catch (\Exception $exception){
            return ApiResponse::error($exception);
        }

        return ApiResponse::success($result, "Lista de eventos");
    }
    public function delete($id)
    {
        try {
            $this->eventNotificationService->delete($id);
        } catch (\Exception $exception){
            return ApiResponse::error($exception);
        }

        return ApiResponse::success(null, "Evento excluido com sucesso");
    }
}
