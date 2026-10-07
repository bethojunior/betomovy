<?php

namespace App\Http\Controllers\User;

use App\Exceptions\User\UserTypeException;
use App\Http\Requests\User\UpdateUserTypeRequest;
use App\Http\Requests\User\UserTypeRequest;
use App\Http\Responses\ApiResponse;
use App\Repositories\User\UserTypeRepository;
use App\Services\User\UserTypeService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class UserTypeController extends Controller
{
    /**
     * @var UserTypeService
     */
    private $service;

    public function __construct(UserTypeService $service)
    {
        $this->service = $service;
    }

    public function findAllActives()
    {
        try {
            $data = $this->service->findAllActives();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar os tipos de usuários ativos.");
        }

        return ApiResponse::success($data);
    }

    public function driversType()
    {
        try {
            $result = $this->service->findDriversType();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar os tipos de motorista");
        }

        return ApiResponse::success($result);
    }

    public function insert(UserTypeRequest $request)
    {
        try {
            $result = $this->service
                ->insert($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir um tipo de motorista");
        }

        return ApiResponse::created($result, "Tipo de motorista criado com sucesso");
    }

    public function update($id, UpdateUserTypeRequest $request)
    {
        try {
            $result = $this->service
                ->update($id, $request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar tipo de motorista");
        }

        return ApiResponse::success($result);
    }

    public function enable($id)
    {
        try {
            $result = $this->service
                ->updateStatus($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao ativar tipo de motorista");
        }

        return ApiResponse::success($result);
    }

    public function disable($id)
    {
        try {
            $result = $this->service
                ->updateStatus($id, 0);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao desabilitar tipo de motorista");
        }

        return ApiResponse::success($result);
    }

    public function delete($id)
    {
        try {
            $result = $this->service
                ->delete($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao excluir tipo de motorista");
        }

        return ApiResponse::success($result);
    }

    public function moveUsers(int $oldUserTypeId, int $newUserTypeId)
    {
        try {
            $result = $this->service
                ->moveUsers($oldUserTypeId, $newUserTypeId);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao mover os usuários da categoria $oldUserTypeId para a categoria $newUserTypeId");
        }

        return ApiResponse::success($result);
    }
}
