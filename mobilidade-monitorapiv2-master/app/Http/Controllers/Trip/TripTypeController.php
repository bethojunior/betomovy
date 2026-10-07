<?php

namespace App\Http\Controllers\Trip;

use App\Http\Requests\Trip\TripTypeRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Trip\TripType;
use App\Services\Trip\TripTypeService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class TripTypeController extends Controller
{
    /**
     * @var TripTypeService
     */
    private $service;

    public function __construct(TripTypeService $service)
    {
        $this->service = $service;
    }

    public function all()
    {
        try {
            $tripTypes = $this->service
                ->all();
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], "Erro ao buscar os tipos de viagens");
        }

        return ApiResponse::success($tripTypes, "Tipos de viagem encontrados");
    }

    public function insert(TripTypeRequest $request)
    {
        try {
            $result = $this->service
                ->insert($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir o tipo de viagem");
        }

        return ApiResponse::created($result, "Tipo de viagem criado com sucesso");
    }

    public function update(TripType $tripType, TripTypeRequest $request)
    {
        try {
            $result = $this->service
                ->update($tripType, $request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar tipo de chamado");
        }

        return ApiResponse::success($result, "Tipo de viagem atualizado com sucesso");
    }

    public function delete($id)
    {
        try {
            $result = $this->service->delete($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao excluir tipo de viagem");
        }

        return ApiResponse::success($result);
    }
}
