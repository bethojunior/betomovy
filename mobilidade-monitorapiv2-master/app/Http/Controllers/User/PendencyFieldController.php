<?php

namespace App\Http\Controllers\User;

use App\Http\Requests\User\PendencyFieldRequest;
use App\Http\Responses\ApiResponse;
use App\Services\User\PendencyFieldService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PendencyFieldController extends Controller
{
    /**
     * @var PendencyFieldService
     */
    private $service;

    public function __construct(PendencyFieldService $service)
    {
        $this->service = $service;
    }

    public function insert(PendencyFieldRequest $request)
    {
        try {
            $result = $this->service
                ->insert($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir campos pendentes");
        }

        return ApiResponse::created($result);
    }

    public function updateStatus($id, Request $request)
    {
        try {
            $result = $this->service
                ->updateStatus($id, $request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar status");
        }

        return ApiResponse::success($result);
    }

    public function delete($id)
    {
        try {
            $result = $this->service
                ->delete($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao remover pendencia");
        }

        return ApiResponse::success($result);
    }

    public function getByUser($userId)
    {
        try {
            $result = $this->service
                ->findByUser($userId);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao pendências do usuário");
        }

        return ApiResponse::success($result);
    }
}
