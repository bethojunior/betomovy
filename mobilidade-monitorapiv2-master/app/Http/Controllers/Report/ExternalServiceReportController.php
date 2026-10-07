<?php


namespace App\Http\Controllers\Report;


use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\Report\ExternalService\ExternalServiceReportService;
use Illuminate\Http\Request;

class ExternalServiceReportController extends Controller
{
    private $service;

    public function __construct(ExternalServiceReportService $service)
    {
        $this->service = $service;
    }

    public function findAllSms(Request $request)
    {
        try {
            $data = $this->service->findAllSms($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::arrayExcel($data, $request['isPdf']);
    }
}
