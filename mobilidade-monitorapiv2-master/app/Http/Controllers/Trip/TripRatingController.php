<?php


namespace App\Http\Controllers\Trip;


use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\Trip\TripRatingService;
use Illuminate\Http\Request;

class TripRatingController extends Controller
{
    private $service;

    public function __construct(TripRatingService $service)
    {
        $this->service = $service;
    }

    public function findAll(Request $request)
    {
        try {
            $data = $this->service->findAll($request->query->all(), $request->header('cityid'));
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar avaliações das viagens");
        }

        return ApiResponse::success($data, "Lista de avaliações de viagens");
    }
}
