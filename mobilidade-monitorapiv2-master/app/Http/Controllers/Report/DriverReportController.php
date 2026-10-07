<?php

namespace App\Http\Controllers\Report;

use App\Exceptions\Report\ReportException;
use App\Http\Responses\ApiResponse;
use App\Services\Report\Driver\DriverReportService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class DriverReportController extends Controller
{
    /**
     * @var DriverReportService
     */
    private $service;

    /**
     * DriverReportController constructor.
     * @param DriverReportService $service
     */
    public function __construct(DriverReportService $service)
    {
        $this->service = $service;
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function findAll(Request $request)
    {
        try {
            $result = $this->service->findAll($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao gerar relatório");
        }

        return ApiResponse::arrayExcel($result, $request->query('isPdf'));
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function financialTripDrivers(Request $request)
    {
        try {
            $result = $this->service
                ->financialTripDrivers($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao gerar relatório");
        }

        return ApiResponse::multipleSheetsExcel($result, $request->query('isPdf'));
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function driverTripHistory(Request $request)
    {
        try {
            $result = $this->service
                ->driverTripHistory($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao gerar relatório");
        }

        return ApiResponse::arrayExcel($result, $request->query('isPdf'));
    }

    public function financialTripDriversLessFilter(Request $request)
    {
        try {
            $result = $this->service
                ->financialTripDriversLessFilter($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao gerar relatório");
        }

        return ApiResponse::multipleSheetsExcel($result, $request->query('isPdf'));
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\Response|\Maatwebsite\Excel\BinaryFileResponse
     */
    public function historyDriverAllTripsValues(Request $request)
    {
        try {
            $result = $this->service
                ->historyDriverAllTripsValues($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao gerar relatório");
        }

        return ApiResponse::arrayExcel($result, $request->query('isPdf'));
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\Response|\Maatwebsite\Excel\BinaryFileResponse
     */
    public function driverOnlineTime(Request $request)
    {
        try {
            $result = $this->service
                ->driverOnlineTime($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao gerar relatório");
        }

        return ApiResponse::arrayExcel($result, $request->query('isPdf'));
    }

    public function prepaidPurchase(Request $request)
    {
        try {
            $result = $this->service
                ->prepaidPurchase($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao gerar relatório");
        }

        return ApiResponse::arrayExcel($result, $request->query('isPdf'));
    }

    public function feeManagement(Request $request)
    {
        try {
            $result = $this->service
                ->feeManagement($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao gerar relatório");
        }

        return ApiResponse::arrayExcel($result, $request->query('isPdf'));
    }

    public function balanceDrivers(Request $request)
    {
        try {
            $result = $this->service
                ->balanceDrivers($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao gerar relatório");
        }

        return ApiResponse::arrayExcel($result, $request->query('isPdf'));
    }

    public function blockedDrivers(Request $request)
    {
        try {
            $result = $this->service
                ->blockedDrivers($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao gerar relatório");
        }

        return ApiResponse::arrayExcel($result, $request->query('isPdf'));
    }

    public function synthetic(Request $request)
    {
        try {
            $driverIds = $request->input('drivers', []);
            $result = $this->service
                ->synthetic($request->query->all(), $driverIds);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao gerar relatório");
        }

        return ApiResponse::success($result, 'Relatório gerado com sucesso');
    }

    public function customersBlockedByDrivers(Request $request)
    {
        try {
            $result = $this->service
                ->customerBlockedByDriver($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao gerar relatório");
        }

        return ApiResponse::arrayExcel($result, $request->query('isPdf'));
    }

    public function vehicleData(Request $request)
    {
        try {
            $result = $this->service
                ->vehicleData($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao gerar relatório");
        }

        return ApiResponse::arrayExcel($result, $request->query('isPdf'));
    }

    public function excludedDrivers(Request $request)
    {
        try {
            $result = $this->service
                ->excludedDrivers($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao gerar relatório");
        }

        return ApiResponse::arrayExcel($result, $request->query('isPdf'));
    }


}
