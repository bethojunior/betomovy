<?php


namespace App\Http\Controllers\Trip;


use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\Trip\TripReportService;
use Illuminate\Http\Request;

class TripReportController extends Controller
{
    private $service;

    public function __construct(TripReportService $service)
    {
        $this->service = $service;
    }

    public function findAll(Request $request)
    {
        try {
            $data = $this->service->findAll($request->query->all(), $request->header('cityid'));
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }
}
