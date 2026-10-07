<?php

namespace App\Http\Controllers\CallGroup;

use App\Http\Controllers\Controller;
use App\Http\Requests\CallGroup\CallGroupRequest;
use App\Http\Requests\CallGroup\LinkedDriverRequest;
use Illuminate\Http\Request;
use App\Http\Responses\ApiResponse;
use App\Services\CallGroup\CallGroupService;

class CallGroupController extends Controller
{
    private $service;

    public function __construct(CallGroupService $service)
    {
        $this->service = $service;
    }

    public function linkDriver(LinkedDriverRequest $request)
    {
        try {
            $response = $this->service->linkDriver($request->all());
        } catch (\Exception $error) {
            return ApiResponse::error($error, "Erro ao vincular motorista");
        }

        return ApiResponse::success($response, "Motorista vinculado com sucesso");
    }

    public function unlinkDriver(LinkedDriverRequest $request)
    {
        try {
            $response = $this->service->unlinkDriver($request->all());
        } catch (\Exception $error) {
            return ApiResponse::error($error, "Erro ao desvincular motorista");
        }

        return ApiResponse::success($response, "Motorista desvinculado com sucesso");
    }

    public function findLinkedDrivers($id)
    {
        try {
            $response = $this->service->findLinkedDrivers($id);
        } catch (\Exception $error) {
            return ApiResponse::error($error, "Erro ao encontrar motoristas vinculados");
        }

        return ApiResponse::success($response, "Motoristas vinculados encontrados");
    }

    public function searchDriverByName(Request $request)
    {
        try {
            $response = $this->service->searchDriver($request);
        } catch (\Exception $error) {
            return ApiResponse::error($error, "Erro ao encontrar motoristas");
        }

        return ApiResponse::success($response, "Motoristas encontrados");
    }

    public function findAll()
    {
        try {
            $response = $this->service->getAllCallGroup();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar grupos de chamados");
        }

        return ApiResponse::success($response, "Grupos de chamados encontrados");
    }

    public function insert(CallGroupRequest $request)
    {
        try {
            $response = $this->service->addCallGroup($request->all());
        } catch (\Exception $error) {
            return ApiResponse::error($error, "Erro ao adicionar grupo de chamado");
        }

        return ApiResponse::success($response, "Grupo de chamado cadastrado com sucesso");
    }

    public function update(CallGroupRequest $request, $id)
    {
        try {
            $response = $this->service->updateCallGroup($request->all(), $id);
        } catch (\Exception $error) {
            return ApiResponse::error($error, "Erro ao atualizar grupo de chamado");
        }

        return ApiResponse::success($response, "Grupo de chamado atualizado com sucesso");
    }

    public function delete(int $id)
    {
        try {
            $response = $this->service->deleteCallGroup($id);
        } catch (\Exception $error) {
            return ApiResponse::error($error, "Erro ao deletar grupo de chamado");
        }

        return ApiResponse::success($response, "Grupo de chamado deletado com sucesso");
    }
}
