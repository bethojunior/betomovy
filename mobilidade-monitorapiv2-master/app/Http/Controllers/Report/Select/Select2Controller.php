<?php

namespace App\Http\Controllers\Report\Select;

use App\Http\Responses\ApiResponse;
use App\Repositories\Report\Select\CompanySelectRepositoy;
use App\Repositories\Report\Select2\CentralSelectRepository;
use App\Repositories\Report\Select2\CompanySelectRepository;
use App\Repositories\Report\Select2\CustomerSelectRepository;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class Select2Controller extends Controller
{
    public function listCustomers(Request $request, CustomerSelectRepository $repository)
    {
        try {
            $result = $repository
                ->listBySelect2($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar os clientes");
        }

        return ApiResponse::success($result);
    }

    public function listCustomersWithUser(Request $request, CustomerSelectRepository $repository)
    {
        try {
            $result = $repository
                ->listSelect2WithUserId($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar os clientes");
        }

        return ApiResponse::success($result);
    }

    /**
     * @param Request $request
     * @param CompanySelectRepository $companySelectRepository
     * @return \Illuminate\Http\JsonResponse
     */
    public function listByCompany(Request $request, CompanySelectRepository $companySelectRepository)
    {
        try {
            $result = $companySelectRepository->listBySelect2($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar select");
        }

        return ApiResponse::success($result);
    }

    public function listByCentral(Request $request, CentralSelectRepository $centralSelectRepository)
    {
        try {
            $result = $centralSelectRepository->listBySelect2($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar select");
        }

        return ApiResponse::success($result);
    }
}
