<?php

namespace App\Http\Controllers\Central;

use App\Http\Controllers\Controller;
use App\Http\Requests\Central\NeighborhoodRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Central\NeighborhoodService;
use Illuminate\Http\Request;

class NeighborhoodController extends Controller
{
    private $service;

    public function __construct(NeighborhoodService $service)
    {
        $this->service = $service;
    }

    public function store(NeighborhoodRequest $request)
    {
        try {
            $result = $this->service->store($request->validated());
        }catch (\Exception $exception){
            return ApiResponse::error($exception, "Ocorreu erro ao tentar salvar bairro");
        }

        return ApiResponse::created($result,"Bairro salvo com sucesso");
    }

    public function findAll(Request $request)
    {
        try {
            $results = $this->service->findAll($request->header('cityid'));
        }catch (\Exception $exception){
            return ApiResponse::error($exception, "Ocorreu erro ao tentar listar bairros");
        }

        return ApiResponse::success($results,"Lista de bairros");
    }

    public function delete($id)
    {
        try {
            $this->service->delete($id);
        }catch (\Exception $exception){
            return ApiResponse::error($exception, "Ocorreu erro ao tentar excluir bairro");
        }

        return ApiResponse::success(null,"Bairro excluido");
    }
}
