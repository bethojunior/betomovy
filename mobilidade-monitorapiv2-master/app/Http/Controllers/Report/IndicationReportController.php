<?php


namespace App\Http\Controllers\Report;


use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\Report\Indication\IndicationReportService;
use Illuminate\Http\Request;

class IndicationReportController extends Controller
{
    private $service;

    /**
     * IndicationReportController constructor.
     * @param IndicationReportService $service
     */
    public function __construct(IndicationReportService $service)
    {
        $this->service = $service;
    }

    public function findAll(Request $request)
    {
        try {
            $data = $this->service->findAll($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::arrayExcel($data, $request['isPdf']);
    }

    public function findByWhoIndicatedId(Request $request)
    {
        try {
            if (!$request->query('userId')) throw new \Exception("Sem usuário");
            $data = $this->service->findByWhoIndicatedId($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::arrayExcel($data, $request['isPdf']);
    }
}
