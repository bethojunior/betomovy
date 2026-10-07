<?php

namespace App\Http\Controllers\Central;

use App\Http\Controllers\Controller;
use App\Http\Requests\Central\CentralNeighborhoodRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Central\Central;
use App\Models\Central\CentralNeighborhood;
use App\Services\Central\CentralNeighborhoodService;

class CentralNeighborhoodController extends Controller
{
    private $service;

    public function __construct(CentralNeighborhoodService $service)
    {
        $this->service = $service;
    }

    public function store(CentralNeighborhoodRequest $request)
    {
        try{
            $result = $this->service->store($request->validated());
        }catch (\Exception $exception){
            return ApiResponse::error($exception,"Ocorreu um erro ao tentar salvar taxa do bairro");
        }

        return ApiResponse::created($result, "Taxa do bairro salvo com sucesso");
    }

    public function findByCentral(Central $central)
    {
        try{
            $results = $this->service->findByCentral($central->id);
        }catch (\Exception $exception){
            return ApiResponse::error($exception,"Ocorreu um erro ao tentar listar taxas do bairro");
        }

        return ApiResponse::success($results, "Listagem de taxas de bairro");
    }

    public function delete(CentralNeighborhood $centralNeighborhood)
    {
        try{
            $this->service->delete($centralNeighborhood);
        }catch (\Exception $exception){
            return ApiResponse::error($exception,"Ocorreu um erro ao tentar excluir taxa do bairro");
        }

        return ApiResponse::success(null, "Taxas de bairro excluida");
    }
}
