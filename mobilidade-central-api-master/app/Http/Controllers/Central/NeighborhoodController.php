<?php

namespace App\Http\Controllers\Central;

use App\Http\Controllers\Controller;
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

    public function findByCityArea(Request $request)
    {
        try{
            $results = $this->service->findByCityArea($request->all());
        }catch (\Exception $exception){
            return ApiResponse::error($exception,"Ocorreu erro ao tentar buscar lista de bairros");
        }

        return ApiResponse::success($results, "Listagem de bairros");
    }
}
