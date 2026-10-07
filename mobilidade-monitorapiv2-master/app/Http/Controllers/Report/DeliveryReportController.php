<?php


namespace App\Http\Controllers\Report;


use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\Report\Delivery\DeliveryReportService;
use Illuminate\Http\Request;

class DeliveryReportController extends Controller
{
    private $service;

    public function __construct(DeliveryReportService $service)
    {
        $this->service = $service;
    }

    public function allOrders(Request $request)
    {
        try {
            $data = $this->service->allOrders($request->query->all(), $request->header('cityid'));
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::arrayExcel($data, $request->query('isPdf'));
    }

    public function deliveryFeeManagement(Request $request)
    {
        try {
            $data = $this->service->deliveryFeeManagement($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::arrayExcel($data, $request->query('isPdf'));
    }
}
