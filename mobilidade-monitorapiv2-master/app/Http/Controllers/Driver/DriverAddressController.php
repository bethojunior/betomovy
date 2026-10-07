<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Http\Requests\Driver\DriverAddressRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Driver\DriverAddressService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DriverAddressController extends Controller
{
    private DriverAddressService $driverAddressService;

    public function __construct(DriverAddressService $driverAddressService)
    {
        $this->driverAddressService = $driverAddressService;
    }

    public function store(int $driverId, DriverAddressRequest $request): JsonResponse
    {
        $result = $this->driverAddressService->store($driverId, $request->validated());

        return ApiResponse::success($result);
    }
}
