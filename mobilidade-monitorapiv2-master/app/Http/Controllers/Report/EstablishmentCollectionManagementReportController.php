<?php


namespace App\Http\Controllers\Report;


use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\Report\EstablishmentCollectionManagement\EstablishmentCollectionManagementReportService;
use Illuminate\Http\Request;

class EstablishmentCollectionManagementReportController extends Controller
{
    private $service;

    public function __construct(EstablishmentCollectionManagementReportService $service)
    {
        $this->service = $service;
    }


    public function totalChargePerCompany(Request $request)
    {
        try {
            $data = $this->service->totalChargePerCompany($request->query->all(), $request->header('cityid'));
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::arrayExcel($data, $request['isPdf']);
    }
}
