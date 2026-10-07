<?php


namespace App\Http\Controllers\Report;


use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\Report\Voucher\VoucherReportService;
use Illuminate\Http\Request;

class VoucherReportController extends Controller
{
    /**
     * @var VoucherReportService
     */
    private $service;

    public function __construct(VoucherReportService $service)
    {
        $this->service = $service;
    }

    public function voucherMovements(Request $request)
    {
        try {
            $report = $this->service
                ->voucherMovements($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar relatorio");
        }

        return ApiResponse::arrayExcel($report, $request->query('isPdf'));
    }

    public function voucherMovementsByCentral(Request $request)
    {
        try {
            $report = $this->service
                ->voucherMovementsByCentral($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar relatorio");
        }

        return ApiResponse::arrayExcel($report, $request->query('isPdf'));
    }
}
