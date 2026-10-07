<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\Driver\DriverBalanceFlowService;
use Illuminate\Http\Request;

class DriverBalanceFlowController extends Controller
{
    /**
     * @var DriverBalanceFlowService
     */
    private $service;

    public function __construct(DriverBalanceFlowService $service)
    {
        $this->service = $service;
    }

    public function findByDriver(int $driverId, Request $request)
    {
        try {
            $data = $this->service->findByDriver($driverId, $request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage());
        }

        return ApiResponse::success($data);
    }
}
