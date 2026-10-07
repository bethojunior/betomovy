<?php

namespace App\Http\Controllers\Enum;

use App\Http\Responses\ApiResponse;
use App\Services\Enum\RoutePitStopTypeService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class RoutePitStopTypeController extends Controller
{
    /**
     * @var RoutePitStopTypeService
     */
    private $service;

    public function __construct(RoutePitStopTypeService $service)
    {
        $this->service = $service;
    }

    public function all()
    {
        try {
            $result = $this->service->all();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar os tipos de paradas de rotas");
        }

        return ApiResponse::success($result);
    }
}
