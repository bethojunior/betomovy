<?php

namespace App\Http\Controllers\Place;

use App\Http\Responses\ApiResponse;
use App\Services\Place\PlaceSearchService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PlaceController extends Controller
{
    /**
     * @var PlaceSearchService
     */
    private $service;

    public function __construct(PlaceSearchService $service)
    {
        $this->service = $service;
    }

    public function search(Request $request)
    {
        try {
            $result = $this->service->search($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar endereço");
        }

        return ApiResponse::success($result);
    }
}
