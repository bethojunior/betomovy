<?php

namespace App\Http\Controllers\Config;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\Config\IntegrationPartnersService;
use Illuminate\Http\Request;

class IntegrationPartnersController extends Controller
{
    private $service;

    public function __construct(IntegrationPartnersService $service)
    {
        $this->service = $service;
    }

    public function findAll(Request $request)
    {
        try {
            $result = $this->service->findAll();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar as integrações com parceiros");
        }

        return ApiResponse::success($result);
    }

    public function create(Request $request)
    {
        try {
            $result = $this->service->create($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao criar integração com parceiros");
        }

        return ApiResponse::success($result);
    }

    public function update(Request $request, $id)
    {
        try {
            $result = $this->service->update($id, $request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar integração com parceiros");
        }

        return ApiResponse::success($result);
    }

    public function delete(Request $request, $id)
    {
        try {
            $result = $this->service->delete($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao excluir integração com parceiros");
        }

        return ApiResponse::success($result);
    }
}