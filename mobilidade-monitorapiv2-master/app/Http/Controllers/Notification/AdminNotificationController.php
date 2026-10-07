<?php

namespace App\Http\Controllers\Notification;

use App\Http\Controllers\Controller;
use App\Http\Requests\Notification\ReadAdminNotificationRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Notification\AdminNotification;
use App\Services\Notification\AdminNotificationService;
use Illuminate\Http\Request;

class AdminNotificationController extends Controller
{
    /**
     * @var AdminNotificationService
     */
    private $service;

    public function __construct(AdminNotificationService $service)
    {
        $this->service = $service;
    }

    public function all(Request $request)
    {
        try {
            $trip = $this->service
                ->findAll($request->user(), $request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao buscar notificacoes');
        }

        return ApiResponse::success($trip, "Notificações encontradas com sucesso");
    }

    public function findLast(Request $request)
    {
        try {
            $trip = $this->service
                ->findLast($request->header('cityid') ?? null);
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao buscar notificacoes');
        }

        return ApiResponse::success($trip, "Notificações encontradas com sucesso");
    }

    public function markViewed($id, Request $request)
    {
        try {
            $trip = $this->service
                ->toView($id, $request->user());
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao visualizar notificação');
        }

        return ApiResponse::success($trip, "Notificação visualizada com sucesso");
    }

    public function markRead(AdminNotification $adminNotification, ReadAdminNotificationRequest $request)
    {
        try {
            $trip = $this->service
                ->markRead($adminNotification, $request->user());
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao visualizar notificação');
        }

        return ApiResponse::success($trip, "Notificação visualizada com sucesso");
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function clearingNotification(Request $request)
    {
        try {
            $notification = $this->service
                ->clearingNotification($request->user());
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao limpar notificação');
        }

        return ApiResponse::success($notification, "Notificações limpas com sucesso");
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function markAllAsRead(Request $request)
    {
        try {
            $result = $this->service
                ->markAllAsRead($request->user());
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao marcar todas as notificações como lidas');
        }

        return ApiResponse::success($result, "Todas as notificações foram marcadas como lidas com sucesso");
    }
}
