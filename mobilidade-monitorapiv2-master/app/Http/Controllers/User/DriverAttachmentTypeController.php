<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\Driver\DriverAttachmentTypeRequest;
use App\Http\Responses\ApiResponse;
use App\Models\User\Driver\DriverAttachmentType;
use App\Services\User\DriverAttachmentTypeService;
use Illuminate\Http\Request;

class DriverAttachmentTypeController extends Controller
{
    /**
     * @var DriverAttachmentTypeService
     */
    private $service;

    public function __construct(DriverAttachmentTypeService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        try {
            $result = $this->service->findAll();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar os tipos de acessórios");
        }

        return ApiResponse::success($result);
    }

    public function store(DriverAttachmentTypeRequest $request)
    {
        try {
            $result = $this->service
                ->insert($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir tipo de acessório");
        }

        return ApiResponse::created($result);
    }

    public function update(DriverAttachmentType $driverAttachmentType, DriverAttachmentTypeRequest $request)
    {
        try {
            $result = $this->service
                ->update($driverAttachmentType, $request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar tipo de acessório");
        }

        return ApiResponse::success($result);
    }

    public function updatePicture(DriverAttachmentType $driverAttachmentType, Request $request)
    {
        try {
            $result = $this->service
                ->updatePicture($driverAttachmentType, $request->picture);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar foto do tipo de acessório");
        }

        return ApiResponse::success($result);
    }

    public function enable(DriverAttachmentType $driverAttachmentType)
    {
        try {
            $result = $this->service
                ->toggleActive($driverAttachmentType, true);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar status do tipos de acessório");
        }

        return ApiResponse::success($result);
    }

    public function disable(DriverAttachmentType $driverAttachmentType)
    {
        try {
            $result = $this->service
                ->toggleActive($driverAttachmentType, false);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar status do tipos de acessório");
        }

        return ApiResponse::success($result);
    }

    public function delete(DriverAttachmentType $driverAttachmentType)
    {
        try {
            $result = $this->service
                ->delete($driverAttachmentType);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao excluir tipo de acessório");
        }

        return ApiResponse::success($result);
    }
}
