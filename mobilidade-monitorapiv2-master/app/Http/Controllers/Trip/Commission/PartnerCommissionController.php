<?php

namespace App\Http\Controllers\Trip\Commission;

use App\Http\Controllers\Controller;
use App\Http\Requests\Trip\Commission\PartnerCommissionRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Trip\PartnerCommission;
use App\Services\Trip\Commission\PartnerCommissionService;
use Illuminate\Http\Request;

class PartnerCommissionController extends Controller
{
    /**
     * @var PartnerCommissionService
     */
    private $service;

    public function __construct(PartnerCommissionService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        try {
            $result = $this->service
                ->findAll($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "erro ao listar as comissões");
        }

        return ApiResponse::success($result);
    }

    public function insert(PartnerCommissionRequest $partnerCommissionRequest)
    {
        try {
            $result = $this->service
                ->insert($partnerCommissionRequest->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir comissão do parceiro");
        }

        return ApiResponse::created($result);
    }

    public function update(PartnerCommission $partnerCommission, PartnerCommissionRequest $request)
    {
        try {
            $result = $this->service
                ->update($partnerCommission, $request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar comissão");
        }

        return ApiResponse::success($result);
    }

    public function delete(PartnerCommission $partnerCommission)
    {
        try {
            $result = $this->service
                ->delete($partnerCommission);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao excluir comissão");
        }

        return ApiResponse::success($result);
    }
}
