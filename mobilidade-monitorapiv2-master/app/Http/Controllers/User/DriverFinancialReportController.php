<?php

namespace App\Http\Controllers\User;

use App\Http\Responses\ApiResponse;
use App\Http\Controllers\Controller;
use App\Services\Driver\DriverFinancialReportService;
use Illuminate\Http\Request;

class DriverFinancialReportController extends Controller
{
    protected $service;

    public function __construct(DriverFinancialReportService $service)
    {
        $this->service = $service;
    }

    /**
     * Retorna o relatório financeiro do motorista.
     *
     * @param Request $request
     * @param int $driverId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getDriverReport(Request $request, int $driverId)
    {
        $filters = $request->only(['startDate', 'endDate']);

        try {
            $report = $this->service->generateDriverReport($driverId, $filters);
        } catch (\Exception $e) {
            return response($e->getMessage(), 500);
        }
        return ApiResponse::success($report);
    }
}