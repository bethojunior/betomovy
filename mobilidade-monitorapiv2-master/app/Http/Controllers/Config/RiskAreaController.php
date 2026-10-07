<?php

namespace App\Http\Controllers\Config;


use App\Http\Responses\ApiResponse;
use App\Services\Config\RiskAreaService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class RiskAreaController extends Controller
{
    private $service;

    public function __construct(RiskAreaService $service)
    {
        $this->service = $service;
    }

    public function findAll(Request $request)
    {
        try{
            $result = $this->service->findAll($request->header('cityid'),$request->query->all());
        }catch (\Exception $exception){
            return ApiResponse::error($exception, "Erro ao listar área de riscos");
        }

        return ApiResponse::success($result, "Lista de áreas de risco");
    }

    public function refuse($id)
    {
        try{
            $this->service->refuse($id);
        }catch (\Exception $exception){
            return ApiResponse::error($exception, "Erro ao rejeitar área de risco");
        }

        return ApiResponse::success(null, "Área de risco rejeitada");
    }

    public function confirm($id,Request $request)
    {
        try{
            $this->service->confirm($id,$request->all());
        }catch (\Exception $exception){
            return ApiResponse::error($exception, "Erro ao confirmar área de risco");
        }

        return ApiResponse::success(null, "Área de risco confirmada");
    }
}
