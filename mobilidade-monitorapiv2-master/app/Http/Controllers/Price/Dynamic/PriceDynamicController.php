<?php

namespace App\Http\Controllers\Price\Dynamic;

use App\Http\Requests\Price\Dynamic\PriceDynamicRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Price\Dynamic\PriceDynamicService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PriceDynamicController extends Controller
{
    /**
     * @var PriceDynamicService
     */
    private $service;

    public function __construct(PriceDynamicService $service)
    {
        $this->service = $service;
    }

    public function findAll(Request $request)
    {
        try {
            $result = $this->service
                ->findAll($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar os preços dinâmicos");
        }

        return ApiResponse::success($result, "Preços dinâmicos encontrados");
    }

    public function insert(PriceDynamicRequest $request)
    {
        try {
            $payload = $request->all();
            $results = [];
            
            foreach ($payload['tripTypeId'] as $tripTypeId) {
                $data = $payload;
                $data['tripTypeId'] = $tripTypeId;
                $results[] = $this->service->insert($data);
            }
        } catch (\Exception $e) {
            return ApiResponse::error([$e->getMessage()], "Erro ao cadastrar preços dinâmicos.");
        }

        return ApiResponse::created($results, "Preço(s) criado(s) com sucesso.");
    }

    public function enable($id)
    {
        try {
            $result = $this->service
                ->enable($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao ativar preço");
        }

        return ApiResponse::success($result);
    }

    public function disable($id)
    {
        try {
            $result = $this->service
                ->disable($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao desabilitar preço");
        }

        return ApiResponse::success($result);
    }

    public function show($id)
    {
        try {
            $result = $this->service
                ->show($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar preço");
        }

        return ApiResponse::success($result);
    }

    public function update($id, Request $request)
    {
        try {
            $result = $this->service
                ->update($id, $request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar preço");
        }

        return ApiResponse::success($result);
    }

    public function delete($id)
    {
        try {
            $this->service
                ->delete($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao excluir preço");
        }

        return ApiResponse::success(true);
    }
}
