<?php

namespace App\Http\Controllers\Price\Range;

use App\Http\Requests\Price\Range\PriceRangeRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Price\Range\PriceRangeService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PriceRangeController extends Controller
{
    /**
     * @var PriceRangeService
     */
    private $service;

    public function __construct(PriceRangeService $service)
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

    public function insert(PriceRangeRequest $request)
    {
        try {
            $result = $this->service
                ->insert($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir faixa de preço");
        }

        return ApiResponse::created($result);
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

    public function update($id, PriceRangeRequest $request)
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
