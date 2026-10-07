<?php

namespace App\Http\Controllers\Central;

use App\Http\Requests\Central\BlockOrReleaseCentralCustomerRequest;
use App\Http\Requests\Central\DeleteCentralCustomerRequest;
use App\Http\Requests\Central\StoreCentralCustomerRequest;
use App\Http\Requests\Central\UpdateCentralCustomerRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Central\CentralCustomerService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CentralCustomerController extends Controller
{
    /**
     * @var CentralCustomerService
     */
    private $service;

    public function __construct(CentralCustomerService $service)
    {
        $this->service = $service;
    }

    public function find($central_id, $id)
    {
        try {
            $result = $this->service
                ->find($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar cliente");
        }

        return ApiResponse::success($result, "Cliente encontrado com sucesso");
    }

    public function store($central_id, StoreCentralCustomerRequest $request)
    {
        try {
            $result = $this->service
                ->store($central_id, $request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir cliente");
        }

        return ApiResponse::created($result, "Cliente inserido com sucesso");
    }

    public function update($central_id, $id, UpdateCentralCustomerRequest $request)
    {
        try {
            $result = $this->service
                ->update($id, $request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar cliente");
        }

        return ApiResponse::success($result, "Cliente atualizado com sucesso");
    }

    public function delete($central_id, $id, DeleteCentralCustomerRequest $request)
    {
        try {
            $result = $this->service
                ->delete($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao excluir cliente");
        }

        return ApiResponse::success($result, "Cliente excluído com sucesso");
    }

    public function blockOrRelease($central_id, $id, $action, BlockOrReleaseCentralCustomerRequest $request)
    {
        try {
            $result = $this->service
                ->blockOrRelease($id, $action);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao executar ação no cliente");
        }

        return ApiResponse::success($result, "Operação realizada com sucesso");
    }
}
