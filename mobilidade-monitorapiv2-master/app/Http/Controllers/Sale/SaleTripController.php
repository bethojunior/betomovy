<?php

namespace App\Http\Controllers\Sale;

use App\Exceptions\Sale\UniquePromotionCityException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Sale\SaleTripRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Sale\SaleTripService;
use Exception;
use Illuminate\Http\Request;

class SaleTripController extends Controller
{
    private $service;

    public function __construct(SaleTripService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        try {
            $sales = $this->service->all($request->query->all(), $request->header('cityid'));
        } catch (Exception $exception) {
            return ApiResponse::error([
                $exception->getMessage()
            ], "Erro ao buscar promoções");
        }

        return ApiResponse::success($sales, "Promoções encontradas");
    }

    public function store(SaleTripRequest $request)
    {
        try {
            $result = $this->service
                ->store($request->validated());
        } catch (UniquePromotionCityException $exception) {
            return ApiResponse::error(
                $exception->getMessage(),
                "Erro ao cadastrar promoção"
            );
        } catch (Exception $exception) {
            return ApiResponse::error(
                $exception->getMessage(),
                "Erro ao cadastrar promoção"
            );
        }

        return ApiResponse::success($result, "Promoção cadastrada com sucesso");
    }

    public function destroy($id)
    {
        try {
            $result = $this->service
                ->delete((int) $id);
        } catch (Exception $exception) {
            return ApiResponse::error(
                $exception->getMessage(),
                "Erro ao deletar promoção"
            );
        }

        return ApiResponse::success($result, "Promoção deletada com sucesso");
    }

    public function update(SaleTripRequest $request, $id)
    {
        try {
            $result = $this->service
                ->update($request->all(), (int) $id);
        } catch (Exception $exception) {
            return ApiResponse::error(
                $exception->getMessage(),
                "Erro ao alterar promoção"
            );
        }

        return ApiResponse::success($result, "Promoção alterada com sucesso");
    }
}
