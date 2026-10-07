<?php

namespace App\Http\Controllers\Route;

use App\Http\Requests\Route\RouteRequest;
use App\Http\Requests\Route\RouteUpdateRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Route\RouteService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class RouteController extends Controller
{
    /**
     * @var RouteService
     */
    private $service;

    public function __construct(RouteService $service)
    {
        $this->service = $service;
    }

    public function insert(RouteRequest $request)
    {
        try {
            $result = $this->service
                ->insert($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir rota");
        }

        return ApiResponse::created($result, "Rota criada com sucesso");
    }

    public function all(Request $request)
    {
        try {
            $result = $this->service
                ->findAll($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar as rotas");
        }

        return ApiResponse::success($result);
    }

    public function enable($id)
    {
        try {
            $result = $this->service
                ->updateStatus($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao ativar rota");
        }

        return ApiResponse::success($result);
    }

    public function disable($id)
    {
        try {
            $result = $this->service
                ->updateStatus($id, 0);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao desabilitar rota");
        }

        return ApiResponse::success($result);
    }

    public function delete($id)
    {
        try {
            $this->service
                ->delete($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao excluir rota");
        }

        return ApiResponse::success(true);
    }


    public function update($id,RouteUpdateRequest $request)
    {
        try {
            $result = $this->service
                ->update($id,$request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar rota");
        }

        return ApiResponse::success($result, "Rota atualizada com sucesso");
    }


    public function find($id)
    {
        try {
            $result = $this->service
                ->find($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar rota");
        }

        return ApiResponse::success($result);
    }

}
