<?php

namespace App\Http\Controllers\Report;

use App\Http\Responses\ApiResponse;
use App\Services\Report\ReportService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ReportController extends Controller
{
    /**
     * @var ReportService
     */
    private $service;

    public function __construct(ReportService $service)
    {
        $this->service = $service;
    }

    public function findAll(Request $request)
    {
        try {
            if (!$request->query('withType', true)) {
                $result = $this->service->findAll($request->query->all());
                return ApiResponse::success($result);
            }

            $result = $this->service->findAllWithType($request->query->all());
            return ApiResponse::success($result);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar os relatórios");
        }

    }
}
