<?php


namespace App\Http\Controllers\User;


use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\User\PartnerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PartnerController extends Controller
{
    private $service;

    public function __construct(PartnerService $service)
    {
        $this->service = $service;
    }

    public function findAll(Request $request): JsonResponse
    {
        try {
            $data = $this->service->findAll($request->query->all(), $request->header('cityId'));
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar parceiros");
        }

        return ApiResponse::success($data);
    }

    public function changeStatus(Request $request, int $id): JsonResponse
    {
        try {
            $partner = \App\Models\User\Partner::findOrFail($id);
            $newStatus = ((int)$partner->partnerRegisterStatusId === 3) ? 1 : 3;
            $partner->partnerRegisterStatusId = $newStatus;
            $partner->statusId = ($newStatus === 3) ? 2 : 1;
            $partner->save();

            return ApiResponse::success([
                'idPartner' => $id,
                'partnerRegisterStatusId' => $newStatus,
                'partnerRegister' => ($newStatus === 3) ? 'BLOQUEADO' : 'ATIVO'
            ], "Status do parceiro atualizado com sucesso");
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao alterar status do parceiro");
        }
    }
}
