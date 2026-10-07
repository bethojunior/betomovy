<?php

namespace App\Http\Controllers\Role;

use App\Http\Requests\Role\RoleRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Role\InsertRoleService;
use App\Services\Role\RoleService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function all(Request $request, RoleService $service, $id = null)
    {
        try {
            $result = $service
                ->findAll($request->header('userId'), $id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar os perfis");
        }

        return ApiResponse::success($result);
    }

    public function insert(RoleRequest $request, InsertRoleService $service)
    {
        try {
            $result = $service
                ->insert($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir um perfil/regra");
        }

        return ApiResponse::created($result);
    }

    public function update(int $id, RoleRequest $request, InsertRoleService $service)
    {
        try {
            $result = $service
                ->update($id, $request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e,
                "Erro ao atualizar um perfil/regra");
        }

        return ApiResponse::success($result);
    }

    public function delete(int $id, RoleService $service)
    {
        try {
            $result = $service->delete($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e,
                "Erro ao excluir um perfil/regra");
        }

        return ApiResponse::success($result);
    }
}
