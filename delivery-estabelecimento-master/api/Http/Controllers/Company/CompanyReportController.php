<?php


namespace Api\Http\Controllers\Company;


use Api\Http\Responses\ApiResponse;
use Api\Services\Company\CompanyReportService;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpFoundation\Request;

class CompanyReportController extends Controller
{
    private $service;

    public function __construct(CompanyReportService $service)
    {
        $this->service = $service;
    }

    public function orders($companyId,Request $request)
    {
        try {
            $result = $this->service->orders($companyId, $request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::arrayExcel($result);
    }
}
