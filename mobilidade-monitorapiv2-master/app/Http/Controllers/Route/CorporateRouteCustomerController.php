<?php

namespace App\Http\Controllers\Route;

use App\Http\Controllers\Controller;
use App\Http\Requests\Route\CorporateRouteCustomerRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Route\CorporateRouteCustomerService;
use Illuminate\Http\Request;

class CorporateRouteCustomerController extends Controller
{
    /**
     * @var CorporateRouteCustomerService
     */
    private $service;

    public function __construct(CorporateRouteCustomerService $service)
    {
        $this->service = $service;
    }

    public function insert(CorporateRouteCustomerRequest $request)
    {
        try {
            $result = $this->service->insert($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Ocorreu um erro ao inserir o usuário");
        }

        return ApiResponse::success($result, "Usuário inserido com sucesso");
    }

    public function listByCompany($companyId)
    {
        try {
            $result = $this->service->listByCompany($companyId);
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

    public function findCustomerByDocument($companyId, Request $request)
    {
        try {
            $result = $this->service->findCustomerByDocument($request->query("document"), $companyId);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Ocorreu um ao buscar cliente");
        }

        return ApiResponse::success($result, "Cliente encontrado");
    }
}
