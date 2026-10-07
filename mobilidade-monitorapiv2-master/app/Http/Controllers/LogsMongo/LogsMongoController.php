<?php

namespace App\Http\Controllers\LogsMongo;
use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\LogsMongo\LogsMongoService;
use Illuminate\Http\Request;

class LogsMongoController extends Controller
{
  private $service;

  public function __construct(
    LogsMongoService $service
  )
  {
    $this->service = $service;
  }

  public function getLogs(Request $request)
  {
        try {
            $data = $this->service->getLogs($request);
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], "Erro ao buscar logs");
        }

        return ApiResponse::success($data, "Logs do mongo encontrados");
  }

  public function getLogsApplication(Request $request)
  {
        try {
            $data = $this->service->getLogsApplications($request);
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], "Erro ao buscar logs");
        }

        return ApiResponse::success($data, "Logs da aplicação encontrados");
  }

  public function getTransactionLogs(Request $request)
  {
        try {
            $data = $this->service->getTransanctionLogs($request);
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], "Erro ao buscar logs");
        }

        return ApiResponse::success($data, "Logs da aplicação encontrados");
  }


}