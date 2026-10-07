<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\Manager\ManagerService;
use Illuminate\Http\Request;

class ManagerController extends Controller
{
    /**
     * @var ManagerService
     */
    private $managerService;
    public function __construct(ManagerService $managerService)
    {
        $this->managerService = $managerService;
    }

    public function getAllManagers(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $result = $this->managerService->getAllManagers($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error("Erro ao listar os gestores", [
                $e->getMessage()
            ]);
        }

        return ApiResponse::success($result, "Gestores encontrados");
    }

    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $result = $this->managerService->insert($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error("Erro ao inserir gestor", [
                $e->getMessage(), $e->getFile()
            ]);
        }

        return ApiResponse::success("Gestor inserido com sucesso", $result);
    }

    public function getDriversByManager(int $id, Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $result = $this->managerService->findDrivers($id, $request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error("Erro ao listar os motoristas do gestor", [
                $e->getMessage()
            ]);
        }

        return ApiResponse::success($result, "Motoristas encontrados");
    }

    public function removeManager(int $id): \Illuminate\Http\JsonResponse
    {
        try {
            $result = $this->managerService->removeManager($id);
        } catch (\Exception $e) {
            return ApiResponse::error("Erro ao remover gestor", [
                $e->getMessage()
            ]);
        }

        return ApiResponse::success($result, "Gestor removido com sucesso");
    }

    public function getManager(int $id): \Illuminate\Http\JsonResponse
    {
        try {
            $result = $this->managerService->getManager($id);
        } catch (\Exception $e) {
            return ApiResponse::error(null, [
                $e->getMessage()
            ]);
        }

        return ApiResponse::success($result, "Usuário encontrado");
    }

    public function update(int $id, Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $result = $this->managerService->update($id, $request->all());
        } catch (\Exception $e) {
            return ApiResponse::error("Erro ao atualizar gestor", [
                $e->getMessage()
            ]);
        }

        return ApiResponse::success($result, "Gestor atualizado com sucesso");
    }

    public function getAllManagersSelect(): \Illuminate\Http\JsonResponse
    {
        try {
            $result = $this->managerService->getAllManagersSelect();
        } catch (\Exception $e) {
            return ApiResponse::error(false, [
                $e->getMessage()
            ]);
        }

        return ApiResponse::success($result, "Gestores encontrados");
    }

    public function verifyUserIsManager(int $id): \Illuminate\Http\JsonResponse
    {
        try {
            $result = $this->managerService->verifyUserIsManager($id);
        } catch (\Exception $e) {
            return ApiResponse::error(false, [
                $e->getMessage()
            ]);
        }

        return ApiResponse::success($result, "Usuário é gestor");
    }

}
