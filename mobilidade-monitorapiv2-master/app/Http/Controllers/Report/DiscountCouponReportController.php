<?php


namespace App\Http\Controllers\Report;


use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\DiscountCoupon\DiscountCouponService;
use App\Services\Report\DiscountCoupon\DiscountCouponReportService;
use Illuminate\Http\Request;

class DiscountCouponReportController extends Controller
{
    private $service;

    /**
     * DiscountCouponReportController constructor.
     * @param DiscountCouponReportService $service
     */
    public function __construct(DiscountCouponReportService $service)
    {
        $this->service = $service;
    }

    public function findAllDiscountedTrip(Request $request)
    {
        try {
            $result = $this->service->findAllDiscountedTrip($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error('Erro ao buscar relatório');
        }

        return ApiResponse::arrayExcel($result, $request->query('isPdf'));
    }
}
