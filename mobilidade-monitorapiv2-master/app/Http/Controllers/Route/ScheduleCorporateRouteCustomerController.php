<?php

namespace App\Http\Controllers\Route;

use App\Http\Controllers\Controller;
use App\Http\Requests\Route\ScheduleCorporateRouteCustomerRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Route\ScheduleCorporateRouteCustomerService;
use Illuminate\Http\Request;

class ScheduleCorporateRouteCustomerController extends Controller
{
    /**
     * @var ScheduleCorporateRouteCustomerService
     */
    private $service;

    public function __construct(ScheduleCorporateRouteCustomerService $service)
    {
        $this->service = $service;
    }

    public function insert(ScheduleCorporateRouteCustomerRequest $request)
    {
        try {
            $result = $this->service->insert($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Ocorreu um erro ao inserir o usuário");
        }

        return ApiResponse::success($result, "Usuário inserido com sucesso");
    }

    public function listByScheduleCorporateRoute($scheduleCorporateRouteId)
    {
        try {
            $result = $this->service->listByScheduleCorporateRoute($scheduleCorporateRouteId);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Ocorreu um erro ao listar os usuários");
        }

        return ApiResponse::success($result, "Lista de usuário por rota agendada");
    }

    public function delete($id)
    {
        try {
            $this->service->delete($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Ocorreu um erro ao excluir usuário");
        }

        return ApiResponse::success(null, "Usuário excluido com sucesso");
    }
}
