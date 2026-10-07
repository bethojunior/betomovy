<?php

namespace App\Http\Controllers\Central;

use App\Constants\Central\CentralConst;
use App\Exceptions\Central\CentralException;
use App\Http\Requests\Central\CentralRequest;
use App\Http\Requests\Central\InsertOrRemoveBalanceRequest;
use App\Http\Requests\Central\UpdateCentralRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Central\Central;
use App\Services\Central\CentralService;
use Google\Protobuf\Api;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CentralController extends Controller
{
    /**
     * @var CentralService
     */
    private $service;

    public function __construct(CentralService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        try {
            $result = $this->service
                ->findAll($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar as centrais");
        }

        return ApiResponse::success($result);
    }

    public function store(CentralRequest $request)
    {
        try {
            $result = $this->service
                ->store($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir central");
        }

        return ApiResponse::created($result);
    }

    public function centralCallDriver()
    {
        return ApiResponse::success(CentralConst::CENTRAL_CALLS);
    }

    public function balance(InsertOrRemoveBalanceRequest $request)
    {
        try {
            $this->service->centralBalance($request->validated());

            return ApiResponse::success(true, "Valor atualizado com sucesso");
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao tentar atualizar voucher");
        }
    }

    public function update(Central $central, UpdateCentralRequest $request)
    {
        try {
            $result = $this->service
                ->update($central, $request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar central");
        }

        return ApiResponse::success($result);
    }

    public function delete(Central $central)
    {
        try {
            $result = $this->service->delete($central);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao excluir central");
        }

        return ApiResponse::success($result);
    }

    public function find($id)
    {
        try {
            $result = $this->service
                ->find($id);
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], 'Erro ao buscar central');
        }

        return ApiResponse::success($result, 'Central Encontrada');
    }

    public function block(Central $central)
    {
        try {
            $result = $this->service->block($central);
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao bloquear motorista');
        }

        return ApiResponse::success($result);
    }

    public function activate(Central $central)
    {
        try {
            $result = $this->service->activate($central);
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao ativar motorista');
        }

        return ApiResponse::success($result);
    }

    public function getDrivers($centralId)
    {
        try {
            $result = $this->service
                ->findDrivers($centralId);
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], 'Erro ao buscar motoristas da central');
        }

        return ApiResponse::success($result, 'Motoristas encontrados');
    }

    public function getCustomers($centralId, Request $request)
    {
        try {
            $result = $this->service
                ->findCustomers($centralId, $request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], 'Erro ao buscar clientes da central');
        }

        return ApiResponse::success($result, 'Clientes encontrados');
    }

    public function findAllCentralCallTypes()
    {
        try {
            $data = $this->service->findAllCentralCallTypes();
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function updateCentralCallTypes(Request $request)
    {
        try {
            $data = $this->service->updateCentralCallTypes($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }
}
