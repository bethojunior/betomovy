<?php

namespace App\Http\Controllers\Notification;

use App\Http\Requests\Notification\NotificationRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Notification\Notification;
use App\Services\Notification\NotificationService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class NotificationController extends Controller
{

    private $service;

    public function __construct(NotificationService $service)
    {
        $this->service = $service;
    }

    public function findAll(Request $request)
    {
        try {
            $data = $this->service->findAll($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage());
        }

        return ApiResponse::success($data);
    }

    public function insert(NotificationRequest $request)
    {
        try {
            $result = $this->service
                ->insert($request->all());
        } catch (\Exception $exception) {
            return ApiResponse::error($exception->getMessage(), 'Erro ao inserir push');
        }

        return ApiResponse::success($result, 'Push enviado com sucesso');
    }

    public function store(NotificationRequest $request)
    {
        try {
            $data = $this->service->store($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage());
        }

        return ApiResponse::created($data, 'A notificação será enviada');
    }

    public function delete(Notification $notification)
    {
        try {
            $result = $this->service->delete($notification);
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage());
        }

        return ApiResponse::success($result);
    }
}
