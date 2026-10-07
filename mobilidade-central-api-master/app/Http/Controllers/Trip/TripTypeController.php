<?php

namespace App\Http\Controllers\Trip;

use App\Http\Responses\ApiResponse;
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
}
