<?php

namespace App\Http\Controllers\Central;

use App\Http\Requests\Central\PriceRangeCentralRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Price\Range\PriceRangeCentralService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PriceRangeCentralController extends Controller
{
    /**
     * @var PriceRangeCentralService
     */
    private $service;

    public function __construct(PriceRangeCentralService $service)
    {
        $this->service = $service;
    }

    public function findAll(Request $request)
    {
        try {
            $result = $this->service
                ->findAll($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar as faixas de preço");
        }

        return ApiResponse::success($result);
    }

    public function insert(PriceRangeCentralRequest $request)
    {
        try {
            $priceRange = $this->service->insert($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir faixa de preço");
        }

        return ApiResponse::created($priceRange);
    }

    public function delete($id)
    {
        try {
            $result = $this->service
                ->delete($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao excluir faixa de preço");
        }

        return ApiResponse::success($result);
    }

    public function update($id, PriceRangeCentralRequest $request)
    {
        try {
            $result = $this->service
                ->update($id, $request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao editar faixa de preço");
        }

        return ApiResponse::success($result);
    }
}
