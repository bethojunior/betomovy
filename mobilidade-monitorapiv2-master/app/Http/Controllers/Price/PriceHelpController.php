<?php

namespace App\Http\Controllers\Price;

use App\Http\Requests\Price\PriceHelpRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Price\PriceHelpService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PriceHelpController extends Controller
{
    /**
     * @var PriceHelpService
     */
    private $service;

    public function __construct(PriceHelpService $service)
    {
        $this->service = $service;
    }

    public function findAll(Request $request)
    {
        try {
            $result = $this->service
                ->findAll($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar os preços de ajudantes");
        }

        return ApiResponse::success($result);
    }

    public function insert(PriceHelpRequest $request)
    {
        try {
            $result = $this->service
                ->insert($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir preço do ajudante");
        }

        return ApiResponse::created($result);
    }

    public function delete($id)
    {
        try {
            $result = $this->service
                ->delete($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao excluir o preço");
        }

        return ApiResponse::success($result);
    }
}
