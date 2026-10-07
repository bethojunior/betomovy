<?php


namespace App\Http\Controllers\Report;


use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\Report\Voucher\VoucherPurchaseReportService;
use Illuminate\Http\Request;

class VoucherPurchaseReportController extends Controller
{
    /**
     * @var VoucherPurchaseReportService
     */
    private $service;

    public function __construct(VoucherPurchaseReportService $service)
    {
        $this->service = $service;
    }

    public function findAll(Request $request)
    {
        try {
            $report = $this->service
                ->findAll($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar relatorio");
        }

        return ApiResponse::arrayExcel($report, $request->query('isPdf'));
    }
}
