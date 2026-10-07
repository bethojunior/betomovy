<?php

namespace App\Http\Controllers\Config;

use App\Http\Requests\Config\WebMapKeyRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Config\WebMapKeyService;

class WebMapKeyController
{
    private $service;

    public function __construct(WebMapKeyService $service)
    {
        $this->service = $service;
    }

    public function store(WebMapKeyRequest $request)
    {
        try {
            $result = $this->service->store($request->validated());
        } catch (\Exception $exception) {
            return ApiResponse::error($exception, "Ocorreu um erro ao tentar inserir uma nova chave");
        }

        return ApiResponse::created($result, "Chave salva com sucesso");
    }

    public function findAll()
    {
        try {
            $results = $this->service->findAll();
        } catch (\Exception $exception) {
            return ApiResponse::error($exception, "Ocorreu um erro ao tentar buscar lista de chaves");
        }

        return ApiResponse::success($results, "Lista de chaves");
    }

    public function delete($id)
    {
        try {
            $this->service->delete($id);
        } catch (\Exception $exception) {
            return ApiResponse::error($exception, "Ocorreu um erro ao tentar excluir a chave");
        }

        return ApiResponse::success(null, "Chave excluida com sucesso");
    }
}
