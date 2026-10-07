<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/08/2020
 * Time: 16:07
 */

namespace App\Http\Controllers\Notification;


use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Repositories\Notification\AdminNotificationTypeRepository;

class AdminNotificationTypeController extends Controller
{
    /**
     * @var AdminNotificationTypeRepository
     */
    private $repository;

    public function __construct(AdminNotificationTypeRepository $repository)
    {
        $this->repository = $repository;
    }

    public function all()
    {
        try {
            $result = $this->repository->all();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar tipos de notificação");
        }

        return ApiResponse::success($result);
    }
}
