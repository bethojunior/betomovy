<?php

namespace App\Http\Controllers\Locale;

use App\Http\Controllers\Controller;
use App\Http\Requests\Config\CityAreaRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Locale\City;
use App\Services\Config\CityAreaService;
use Illuminate\Http\Request;

class CityAreaController extends Controller
{
    private $service;

    public function __construct(CityAreaService $service)
    {
        $this->service = $service;
    }

    public function store(int $cityId, Request $request)
    {
        try {
            $this->service->store($cityId, $request->all());
        } catch (\Exception $exception){
            return ApiResponse::error($exception, "Ocorreu um erro tentar salvar area");
        }
        return ApiResponse::success(true, "Area da cidade salva");
    }

    public function updateArea($cityId, Request $request)
    {
        try {
            $this->service->updateArea($cityId, $request->all());
        } catch (\Exception $exception){
            return ApiResponse::error($exception, "Ocorreu um erro tentar atualizar area");
        }
        return ApiResponse::success(null, "Area da cidade atualizada");
    }
}
