<?php

namespace App\Http\Controllers\User;

use App\Http\Responses\ApiResponse;
use App\Services\User\UserIndicationReportService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class UserIndicationReportController extends Controller
{
    /**
     * @var UserIndicationReportService
     */
    private $service;

    public function __construct(UserIndicationReportService $service)
    {
        $this->service = $service;
    }

    public function countReferredUsers(Request $request)
    {
        try {
            $result = $this->service
                ->synthetic($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar relatório sintético");
        }

        return ApiResponse::success($result, "Relatório gerado com sucesso");
    }

    public function referredUsers($userId, Request $request)
    {
        try {
            $result = $this->service
                ->analytical($userId, $request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar relatório analítico");
        }

        return ApiResponse::success($result);
    }

    public function commissions(Request $request)
    {
        try {
            $result = $this->service
                ->indicationsCommissions($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar relatório de comissões");
        }

        return ApiResponse::success($result);
    }
}
