<?php


namespace App\Http\Controllers\Audit;

use App\Http\Controllers\Controller;
use App\Http\Requests\Audit\AuditRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Audit\AuditService;
use Illuminate\Http\Request;

class AuditController extends Controller
{

    private $service;

    public function __construct(AuditService $service)
    {
        $this->service = $service;
    }

    public function store(AuditRequest $request)
    {
        try {
            $data = $this->service->store($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao salvar mensagem");
        }

        return ApiResponse::created($data);
    }

    public function findAll(Request $request)
    {
        try {
            $data = $this->service->all($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar mensagens");
        }

        return ApiResponse::success($data);
    }

    public function delete($id)
    {
        try{
            $result = $this->service
                ->delete($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao deletar a mensagem");
        }

        return ApiResponse::success($result);
    }
}
