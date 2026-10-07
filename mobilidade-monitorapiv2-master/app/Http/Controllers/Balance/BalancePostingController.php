<?php

namespace App\Http\Controllers\Balance;

use App\Http\Controllers\Controller;
use App\Http\Requests\Balance\BalancePostingRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Balance\BalancePosting;
use App\Services\Balance\BalancePostingService;
use Illuminate\Http\Request;

class BalancePostingController extends Controller
{
    /**
     * @var BalancePostingService
     */
    private $service;

    public function __construct(BalancePostingService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        try {
            $result = $this->service->getAll();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar os lançamentos financeiros");
        }

        return ApiResponse::success($result);
    }

    public function insert(BalancePostingRequest $request)
    {
        try {
            $result = $this->service
                ->insert($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao criar o lançamento recorrente");
        }

        return ApiResponse::created($result);
    }

    public function delete(BalancePosting $balancePosting)
    {
        try {
            $result = $this->service
                ->delete($balancePosting);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao excluir o lançamento financeiro");
        }

        return ApiResponse::success($result);
    }
}
