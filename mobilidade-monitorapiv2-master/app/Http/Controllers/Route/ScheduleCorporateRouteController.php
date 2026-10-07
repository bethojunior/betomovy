<?php

namespace App\Http\Controllers\Route;

use App\Http\Controllers\Controller;
use App\Http\Requests\Route\ScheduleCorporateRouteDateRequest;
use App\Http\Requests\Route\ScheduleCorporateRouteRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Route\ScheduleCorporateRouteService;

class ScheduleCorporateRouteController extends Controller
{
    /**
     * @var ScheduleCorporateRouteService
     */
    private $service;

    public function __construct(ScheduleCorporateRouteService $service)
    {
        $this->service = $service;
    }

    public function insert(ScheduleCorporateRouteRequest $request)
    {
        try {
            $result = $this->service->insert($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Ocorreu um erro ao agendar a rota");
        }

        return ApiResponse::success($result, "Agendamento de rota inserido com sucesso");
    }

    public function findScheduleByCompany($companyId)
    {
        try {
            $result = $this->service->findScheduleByCompany($companyId);
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($result);
    }

    public function findScheduleCompanyByDate($companyId , ScheduleCorporateRouteDateRequest $request)
    {
        try {
            $result = $this->service->findScheduleCompanyByDate($companyId, $request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($result);
    }

    public function update($id, ScheduleCorporateRouteRequest $request)
    {
        try {
            $result = $this->service->update($id, $request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($result);
    }

    public function delete($id)
    {
        try {
            $this->service->delete($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success(null, "Agendamento de rota excluida com sucesso");
    }
}
