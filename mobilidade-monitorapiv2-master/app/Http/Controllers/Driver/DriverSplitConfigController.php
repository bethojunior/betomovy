<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\Driver\DriverSplitConfigService;
use Illuminate\Http\JsonResponse;

class DriverSplitConfigController extends Controller
{
    private DriverSplitConfigService $service;

    public function __construct(DriverSplitConfigService $service)
    {
        $this->service = $service;
    }

    public function findByDriver(int $driverId): JsonResponse
    {
        $data = $this->service->findByDriver($driverId);

        return ApiResponse::success($data);
    }

    public function store(int $driverId): JsonResponse
    {
        $data = $this->service->store($driverId);

        return ApiResponse::success($data);
    }
}
