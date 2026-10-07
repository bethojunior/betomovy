<?php

namespace App\Http\Controllers\Company;

use App\Http\Requests\Company\CompanyRequest;
use App\Http\Requests\Company\Update;
use App\Http\Responses\ApiResponse;
use App\Services\Company\CompanyService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CompanyController extends Controller
{
    /**
     * @var CompanyService
     */
    private $service;

    public function __construct(CompanyService $service)
    {
        $this->service = $service;
    }

    public function get($id)
    {
        try {
            $result = $this->service
                ->find($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar cliente jurídico");
        }

        return ApiResponse::success($result);
    }

    public function findAll(Request $request)
    {
        try {
            $result = $this->service
                ->findAll($request->query->all(), $request->header('cityid'));
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar os clientes jurídicos");
        }

        return ApiResponse::success($result);
    }

    public function workers($id)
    {
        try {
            $result = $this->service
                ->workers($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar os usuarios");
        }

        return ApiResponse::success($result);
    }

    public function insert(CompanyRequest $request)
    {
        try {
            $result = $this->service
                ->insert($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir cliente jurídico");
        }

        return ApiResponse::created($result);
    }

    public function delete($id)
    {
        try {
            $result = $this->service
                ->delete($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao deletar cliente jurídico");
        }

        return ApiResponse::success($result);
    }

    public function enable($id)
    {
        try {
            $result = $this->service
                ->enable($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao habilitar cliente jurídico");
        }

        return ApiResponse::success($result);
    }

    public function block($id)
    {
        try {
            $result = $this->service
                ->block($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao bloquear cliente jurídico");
        }

        return ApiResponse::success($result);
    }

    /**
     * @param CompanyRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function edit(CompanyRequest $request)
    {
        try {
            $result = $this->service
                ->edit($request->all());
        } catch (\Exception $exception) {
            return ApiResponse::error($exception, "Erro ao editar cliente jurídico");
        }

        return ApiResponse::success($result);
    }

    public function setEstablishmentCollectionManagement(int $id, Request $request)
    {
        try {
            $result = $this->service
                ->setEstablishmentCollectionManagement($id, $request->establishmentCollectionManagementId);
        } catch (\Exception $exception) {
            return ApiResponse::error($exception, "Erro ao salvar gestão de cobrança");
        }

        return ApiResponse::success($result);
    }
}
