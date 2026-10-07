<?php

namespace App\Http\Controllers\Report;

use App\Constants\Pulse\GroupPulseConst;
use App\Http\Controllers\Controller;
use App\Http\Requests\Report\ReportRecordRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Report\ReportRecordService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Services\Pulse\PulseService;

class ReportRecordController extends Controller
{
    private $service;
    public  $pulse;

    public function __construct(ReportRecordService $service)
    {
        $this->service = $service;
        $this->pulse = new PulseService('monitor-api-' . env('APP_NAME'), GroupPulseConst::REPORT);
    }

    public function findAll(Request $request): JsonResponse
    {
        try {
            $data = $this->service->findAll($request->query->all());
        } catch (\Exception $exception) {
            return ApiResponse::error($exception);
        }
        return ApiResponse::success($data);
    }

    public function store(ReportRecordRequest $request): JsonResponse
    {
        try {
            $data = $this->service->store($request->validated());
        } catch (\Exception $exception) {
            return ApiResponse::error($exception);
        }
        return ApiResponse::success($data);
    }
}
