<?php

namespace App\Http\Controllers\Monetization;

use App\Http\Responses\ApiResponse;
use App\Services\Monetization\MonetizationReportService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class MonetizationReportController extends Controller
{
    /**
     * @var MonetizationReportService
     */
    private $service;

    public function __construct(MonetizationReportService $service)
    {
        $this->service = $service;
    }

    public function synthetic(Request $request)
    {
        try {
            $result = $this->service
                ->synthetic($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar relatório sintético da monetização");
        }

        return ApiResponse::success($result, "Relatório sintético de monetização encontrado");
    }
}
