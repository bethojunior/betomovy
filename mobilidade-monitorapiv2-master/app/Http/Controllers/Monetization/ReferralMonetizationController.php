<?php

namespace App\Http\Controllers\Monetization;

use App\Http\Requests\Monetization\ReferralMonetizationRequest;
use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\Monetization\ReferralMonetizationService;
use Illuminate\Http\Request;


class ReferralMonetizationController extends Controller
{
    /**
     * @var ReferralMonetizationService
     */
    private $service;

    public function __construct(ReferralMonetizationService $service)
    {
        $this->service = $service;
    }

    public function insert(ReferralMonetizationRequest $request)
    {
        try {
            $result = $this->service
                ->insert($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir monetização por indicação");
        }

        return ApiResponse::created($result, "Monetização por indicação inserida com sucesso");
    }

    public function findAll(Request $request)
    {
        try {
            $result = $this->service
                ->findAll($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar as monetizações por indicação");
        }

        return ApiResponse::success($result, "Monetizações por indicação encontradas com sucesso");
    }

    public function update(ReferralMonetizationRequest $request, $id)
    {
        try {
            $result = $this->service
                ->update($id, $request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar monetização por indicação");
        }

        return ApiResponse::success($result, "Monetização por indicação atualizado com sucesso");
    }

    public function delete($id)
    {
        try {
            $result = $this->service
                ->delete($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao excluir monetização por indicação");
        }

        return ApiResponse::success($result, "Monetização por indicação excluído com sucesso");
    }
}
