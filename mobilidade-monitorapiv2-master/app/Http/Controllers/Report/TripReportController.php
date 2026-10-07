<?php

namespace App\Http\Controllers\Report;

use App\Http\Responses\ApiResponse;
use App\Services\Report\Trip\TripReportService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class TripReportController extends Controller
{
    /**
     * @var TripReportService
     */
    private $service;

    /**
     * TripReportController constructor.
     * @param TripReportService $service
     */
    public function __construct(TripReportService $service)
    {
        $this->service = $service;
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function totalValuesByDriver(Request $request)
    {
        try {
            $result = $this->service
                ->totalValuesByDriver($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao buscar relatorio de ganhos por motorista');
        }

        return ApiResponse::success($result);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function tripHistory(Request $request)
    {
        try {
            $result = $this->service
                ->countersTripHistory($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao buscar histórico de viagens');
        }

        return ApiResponse::arrayExcel($result, $request->query('isPdf'));
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function listAll(Request $request)
    {
        try {
            $result = $this->service
                ->listAll($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao buscar relatório de viagens');
        }

        return ApiResponse::multipleSheetsExcel($result, $request->query('isPdf'));
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function listAllWithCentralFee(Request $request)
    {
        try {
            $result = $this->service
                ->listAllWithCentralFee($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao buscar relatório de viagens');
        }

        return ApiResponse::arrayExcel($result,$request->query('isPdf'));
    }

    public function corporateTravelList(Request $request)
    {
        try {
            $result = $this->service
                ->corporateTravelList($request->all(), $request->header('cityid'));
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar relatório de viagens Pessoa Jurídica");
        }

        return ApiResponse::arrayExcel($result, $request->query('isPdf'));
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\Response|\Maatwebsite\Excel\BinaryFileResponse
     */
    public function financialStatementAdministrativeVoucher(Request $request)
    {
        try {
            $result = $this->service
                ->financialStatementAdministrativeVoucher($request->all(), $request->header('cityid'));
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar relatório");
        }

        return ApiResponse::arrayExcel($result, $request->query('isPdf'));
    }

    public function getAllSharedRoutes(Request $request){
        try {
            $result = $this->service
                ->getAllSharedRoutes($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar relatório");
        }

        return ApiResponse::arrayExcel($result, $request->query('isPdf'));
    }

    public function callProduction(Request $request)
    {
        try {
            $result = $this->service
                ->callProduction($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar relatório");
        }

        return ApiResponse::arrayExcel($result, $request->query('isPdf'));
    }
}
