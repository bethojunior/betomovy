<?php


namespace App\Http\Controllers\Report;


use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\Report\Audit\InternalAuditReportService;
use Illuminate\Http\Request;

class InternalAuditReportController extends Controller
{
    private $service;

    public function __construct(InternalAuditReportService $service)
    {
        $this->service = $service;
    }


    public function accessLog(Request $request)
    {
        try {
            $data = $this->service->accessLog($request->query->all());
        } catch (\Exception $exception) {
            return ApiResponse::error($exception, 'Erro ao gerar relatório');
        }

        return ApiResponse::arrayExcel($data, $request->query('isPdf'));
    }
}
