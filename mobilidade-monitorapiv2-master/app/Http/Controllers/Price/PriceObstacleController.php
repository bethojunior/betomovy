<?php

namespace App\Http\Controllers\Price;

use App\Http\Requests\Price\PriceObstacleRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Price\PriceObstacleService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PriceObstacleController extends Controller
{
    /**
     * @var PriceObstacleService
     */
    private $service;

    public function __construct(PriceObstacleService $service)
    {
        $this->service = $service;
    }

    public function findAll(Request $request)
    {
        try {
            $result = $this->service
                ->findAll($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar os preços de obstáculos");
        }

        return ApiResponse::success($result);
    }

    public function insert(PriceObstacleRequest $request)
    {
        try {
            $result = $this->service
                ->insert($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir preço do obstáculo");
        }

        return ApiResponse::created($result);
    }

    public function delete($id)
    {
        try {
            $result = $this->service
                ->delete($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao excluir o preço");
        }

        return ApiResponse::success($result);
    }
}
