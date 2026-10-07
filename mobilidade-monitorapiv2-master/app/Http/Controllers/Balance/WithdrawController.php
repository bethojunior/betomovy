<?php

namespace App\Http\Controllers\Balance;

use App\Http\Controllers\Controller;
use App\Http\Requests\Balance\WithdrawsRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Balance\Withdraw;
use App\Models\Balance\WithdrawSummaryView;
use App\Services\Balance\WithdrawService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WithdrawController extends Controller
{
    private $service;

    function __construct(WithdrawService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request): JsonResponse
    {
        try {
            $results = $this->service
                ->findAll($request->query->all(), $request->header('cityid'));
        } catch (Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar as transferencias");
        }

        return ApiResponse::success($results);
    }

    public function show($withdrawId): JsonResponse
    {
        try {
            $result = $this->service->findAccountByWithdrawId($withdrawId);

            return ApiResponse::success($result);
        } catch (Exception $e) {
            return ApiResponse::error($e, "Erro ao visualizar a transferência");
        }
    }

    public function confirm(Request $request, Withdraw $withdraw): JsonResponse
    {
        try {
            $type = empty($request->type) || $request->type == 'cartao';
            $result = $this->service
                ->confirm($request->user(), $withdraw, $type);
            return ApiResponse::success($result);
        } catch (Exception $e) {
            return ApiResponse::error($e, "Erro ao confirmar as transferência");
        }
    }

    public function accountBalance(Request $request): JsonResponse
    {
        try {
            $result = $this->service->accountBalance();
            return ApiResponse::success($result);
        } catch (Exception $e) {
            return ApiResponse::error($e, "Erro ao confirmar as transferência");
        }
    }

    public function confirmMultiples(WithdrawsRequest $request): JsonResponse
    {
        try {
            $result = $this->service
                ->confirmMultiples($request->user(), $request->validated());
            return ApiResponse::success($result);
        } catch (Exception $e) {
            return ApiResponse::error($e, "Erro ao confirmar as transferências");
        }
    }

    public function reject(Request $request, Withdraw $withdraw): JsonResponse
    {
        try {
            $reason = $request->input('reason');
            $result = $this->service->reject(
                $request->user(),
                $withdraw,
                $reason
            );
            return ApiResponse::success($result);
        } catch (Exception $e) {
            return ApiResponse::error($e, "Erro ao rejeitar transferência");
        }
    }
}
