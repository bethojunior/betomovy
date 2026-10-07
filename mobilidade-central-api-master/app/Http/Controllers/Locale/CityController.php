<?php

namespace App\Http\Controllers\Locale;

use App\Http\Responses\ApiResponse;
use App\Services\Locale\CityService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CityController extends Controller
{
    /**
     * @var CityService
     */
    private $service;

    public function __construct(CityService $service)
    {
        $this->service = $service;
    }

    public function all(Request $request)
    {
        $query = $request->query->get('q');
        $estateId = $request->query->get('estateId');

        try {
            $cities = $this->service->all($query, $estateId);
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], "Erro ao buscar cidades");
        }

        return ApiResponse::success($cities, "Cidades encontradas");
    }
}
