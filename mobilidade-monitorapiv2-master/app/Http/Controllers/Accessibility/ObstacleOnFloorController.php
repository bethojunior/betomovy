<?php

namespace App\Http\Controllers\Accessibility;

use App\Http\Requests\Freight\Accessibility\ObstacleOnFloorRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Freight\Accessibility\ObstacleOnFloorService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ObstacleOnFloorController extends Controller
{
    /**
     * @var ObstacleOnFloorService
     */
    private $service;

    public function __construct(ObstacleOnFloorService $service)
    {
        $this->service = $service;
    }

    public function insert(ObstacleOnFloorRequest $request)
    {
        try {
            $result = $this->service
                ->insert($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir obstáculo");
        }

        return ApiResponse::created($result, "Obstáculo criado com sucesso");
    }

    public function findAll()
    {
        try {
            $result = $this->service
                ->findAll();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar os obstáculos");
        }

        return ApiResponse::success($result);
    }

    public function delete($id)
    {
        try {
            $result = $this->service
                ->delete($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao excluir obstáculo");
        }

        return ApiResponse::success($result, "Excluído com sucesso");
    }
}
