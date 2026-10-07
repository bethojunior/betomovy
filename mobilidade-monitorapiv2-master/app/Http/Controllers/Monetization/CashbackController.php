<?php

namespace App\Http\Controllers\Monetization;

use App\Http\Requests\Monetization\CashbackRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Monetization\CashbackService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CashbackController extends Controller
{
    /**
     * @var CashbackService
     */
    private $service;

    public function __construct(CashbackService $service)
    {
        $this->service = $service;
    }

    public function all(Request $request)
    {
        try {
            $result = $this->service
                ->findAll($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar a lista de cashbacks");
        }

        return ApiResponse::success($result);
    }

    public function insert(CashbackRequest $request)
    {
        try {
            $result = $this->service
                ->insert($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir cashback");
        }

        return ApiResponse::created($result, 'Cashback criado com sucesso');
    }

    public function enable($id)
    {
        try {
            $result = $this->service
                ->updateStatus($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao ativar cashback");
        }

        return ApiResponse::success($result);
    }

    public function disable($id)
    {
        try {
            $result = $this->service
                ->updateStatus($id, 0);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao desabilitar cashback");
        }

        return ApiResponse::success($result);
    }

    public function delete($id)
    {
        try {
            $this->service
                ->delete($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao excluir rota");
        }

        return ApiResponse::success(true);
    }
}
