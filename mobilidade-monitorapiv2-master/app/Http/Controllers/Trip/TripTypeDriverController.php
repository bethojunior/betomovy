<?php

namespace App\Http\Controllers\Trip;

use App\Http\Requests\Trip\TripTypeDriverRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Trip\TripTypeDriverService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class TripTypeDriverController extends Controller
{
    /**
     * @var TripTypeDriverService
     */
    private $service;

    public function __construct(TripTypeDriverService $service)
    {
        $this->service = $service;
    }

    public function findAll()
    {
        try {
            $result = $this->service->findAll();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar os tipos de chamados");
        }

        return ApiResponse::success($result);
    }

    public function insert(TripTypeDriverRequest $request)
    {
        try {
            $result = $this->service
                ->insert($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir o tipo de chamado");
        }

        return ApiResponse::created($result);
    }

    public function delete(TripTypeDriverRequest $request)
    {
        try {
            $result = $this->service
                ->delete($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao excluir tipo de chamado");
        }

        return ApiResponse::success($result);
    }
}
