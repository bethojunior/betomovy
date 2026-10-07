<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 28/07/2020
 * Time: 19:00
 */

namespace App\Http\Controllers\FinancialIntermediary;


use App\Http\Controllers\Controller;
use App\Http\Requests\FinancialIntermediary\DeleteByCityFinancialIntermediaryRequest;
use App\Http\Requests\FinancialIntermediary\FinancialIntermediaryRequest;
use App\Http\Requests\FinancialIntermediary\UpdateByCityFinancialIntermediaryRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Acquirer\FinancialIntermediary;
use App\Services\FinancialIntermediary\FinancialIntermediaryService;
use Illuminate\Http\Request;

class FinancialIntermediaryController extends Controller
{
    /**
     * @var FinancialIntermediaryService
     */
    private $service;

    public function __construct(FinancialIntermediaryService $service)
    {
        $this->service = $service;
    }

    public function findAll(Request $request)
    {
        try {
            $result = $this->service->findAll($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar adquirentes");
        }

        return ApiResponse::success($result);
    }

    public function findAllByCity(Request $request)
    {
        try {
            $result = $this->service->findAllByCity($request->header('cityid'), $request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar adquirentes");
        }

        return ApiResponse::success($result);
    }

    public function update(FinancialIntermediary $financialIntermediary, FinancialIntermediaryRequest $request)
    {
        try {
            $result = $this->service
                ->updateActive($financialIntermediary, $request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar adquirente");
        }

        return ApiResponse::success($result);
    }

    public function updateByCity(UpdateByCityFinancialIntermediaryRequest $request)
    {
        try {
            $result = $this->service
                ->updateActiveInCity($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar adquirente");
        }

        return ApiResponse::success($result);
    }

    public function deleteByCity(DeleteByCityFinancialIntermediaryRequest $request)
    {
        try {
            $result = $this->service
                ->deleteActiveInCity($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar adquirente");
        }

        return ApiResponse::success($result, "Sucesso ao remover adquirente");
    }
}
