<?php


namespace App\Http\Controllers\Report\Customer;


use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\Report\Customer\CustomerReportService;
use Illuminate\Http\Request;

class CustomerReportController extends Controller
{

    /**
     * @var CustomerReportService
     */
    private $service;

    /**
     * CustomerReportController constructor.
     * @param CustomerReportService $service
     */
    public function __construct(CustomerReportService $service)
    {
        $this->service = $service;
    }

    public function findAll(Request $request)
    {
        try {
            $result = $this->service
                ->findAll($request->query->all());
        } catch (\Exception $exception) {
            return ApiResponse::error($exception, 'Erro ao gerar relatório');
        }

        return ApiResponse::arrayExcel($result, $request->query('isPdf'));
    }

    public function manualVoucherInsertion(Request $request)
    {
        try {
            $result = $this->service
                ->manualVoucherInsertion($request->query->all(), $request->header('cityid'));

            return ApiResponse::arrayExcel($result, $request->query('isPdf'));
        } catch (\Exception $exception) {
            return ApiResponse::error($exception, 'Erro ao gerar relatório');
        }
    }

    public function driverBlockedByCustomer(Request $request)
    {
        try {
            $result = $this->service
                ->driverBlockedByCustomer($request->query->all());

            return ApiResponse::arrayExcel($result, $request->query('isPdf'));
        } catch (\Exception $exception) {
            return ApiResponse::error($exception, 'Erro ao gerar relatório');
        }
    }
}
