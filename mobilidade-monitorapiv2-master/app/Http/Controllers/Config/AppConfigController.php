<?php

namespace App\Http\Controllers\Config;

use App\Http\Controllers\Controller;
use App\Http\Requests\App\AppConfigRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Config\AppConfigService;
use Illuminate\Http\Request;

class AppConfigController extends Controller
{
    private $service;

    public function __construct(AppConfigService $service)
    {
        $this->service = $service;
    }

    public function findAll()
    {
        try {
            $results = $this->service->findAll();
        } catch (\Exception $exception) {
            return ApiResponse::error($exception, "Ocorreu um erro ao tentar lista configurações de apps");
        }

        return ApiResponse::success($results,"Listagem de configurações de app");
    }

    public function store(AppConfigRequest $request)
    {
        try {
            $result = $this->service->store($request->validated());
        } catch (\Exception $exception) {
            return ApiResponse::error($exception, "Ocorreu um erro ao tentar atualizar configurações de app");
        }

        return ApiResponse::created($result,"Configuração de app atualizada");
    }

    public function delete($id)
    {
        try {
            $this->service->delete($id);
        } catch (\Exception $exception) {
            return ApiResponse::error($exception, "Ocorreu um erro ao tentar excluir configurações de app");
        }

        return ApiResponse::success(null,"Configuração de app excluida");
    }

    public function storeDefaultLogo(Request $request)
    {
        try {
            $this->service->storeDefaultLogo($request['logo'] ?? null);
        } catch (\Exception $exception) {
            return ApiResponse::error($exception);
        }

        return ApiResponse::success("","Logo alterada com sucesso");
    }
}
