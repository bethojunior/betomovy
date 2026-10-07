<?php

namespace App\Http\Controllers\Route;

use App\Http\Controllers\Controller;
use App\Http\Requests\Route\CorporateRouteRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Route\CorporateRouteService;
use App\Services\Route\RouteService;
use Illuminate\Http\Request;

class CorporateRouteController extends Controller
{
    /**
     * @var CorporateRouteService
     */
    private $service;

    public function __construct(CorporateRouteService $service)
    {
        $this->service = $service;
    }

    public function insert(CorporateRouteRequest $request)
    {
        try {
            $result = $this->service->insert($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Ocorreu um erro ao inserir a rota");
        }
        return ApiResponse::success($result, "Rota criada com sucesso");
    }

    public function all()
    {
        try {
            $result = $this->service->all();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar as rotas");
        }

        return ApiResponse::success($result);
    }

    public function delete($id)
    {
        try {
            $this->service->delete($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao excluir rota corporativo");
        }

        return ApiResponse::success(true);
    }

    public function update($id, CorporateRouteRequest $request)
    {
        try {
            $result = $this->service->update($id, $request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar rota corporativo");
        }

        return ApiResponse::success($result);
    }

    public function findCompaniesByRoute($routeId)
    {
        try{
            $result = $this->service->getCompaniesByRoute($routeId);
        }catch (\Exception $e){
            return ApiResponse::error($e, "Erro ao obter usuário da rota");
        }

        return ApiResponse::success($result,"Listagem de usuários por rota");
    }

    public function findRouteByCompany($companyId)
    {
        try{
            $result = $this->service->findRouteByCompany($companyId);
        }catch (\Exception $e){
            return ApiResponse::error($e);
        }

        return ApiResponse::success($result);
    }
}
