<?php

namespace App\Http\Controllers\Price\DriverCommission;

use App\Http\Controllers\Controller;
use App\Http\Requests\Price\DriverCommission\DriverCommissionRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Driver\DriverCommissionService;
use Illuminate\Http\JsonResponse;

class DriverCommissionController extends Controller
{
    /**
     * @var DriverCommissionService
     */
    private $service;

    public function __construct(DriverCommissionService $service)
    {
        $this->service = $service;
    }

    public function getAllByCity(int $cityId): JsonResponse
    {
        return ApiResponse::success($this->service->findByCity($cityId));
    }

    public function store(DriverCommissionRequest $request, int $cityId): JsonResponse
    {
        $commission = $this->service->store($request->validated(), $cityId);

        return ApiResponse::created($commission);
    }
}
