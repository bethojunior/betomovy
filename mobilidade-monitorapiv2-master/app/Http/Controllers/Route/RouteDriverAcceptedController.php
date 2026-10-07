<?php

namespace App\Http\Controllers\Route;

use App\Http\Responses\ApiResponse;
use App\Services\Route\RouteDriverAcceptedService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class RouteDriverAcceptedController extends Controller
{
    /**
     * @var RouteDriverAcceptedService
     */
    private $service;

    public function __construct(RouteDriverAcceptedService $service)
    {
        $this->service = $service;
    }

    public function all(Request $request)
    {
        try {
            $result = $this->service
                ->findAll($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar as rotas solicitadas pelos motoristas");
        }

        return ApiResponse::success($result);
    }

    public function enable($id)
    {
        try {
            $result = $this->service
                ->updateStatus($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao liberar rota para motorista");
        }

        return ApiResponse::success($result);
    }


    public function delete($id)
    {
        try {
            $this->service
                ->delete($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao excluir rota permitida do motorista");
        }

        return ApiResponse::success(true);
    }
}
