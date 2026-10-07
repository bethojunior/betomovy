<?php

namespace App\Http\Controllers\Config\FormStep;

use App\Http\Requests\Config\FormStep\FormStepUserTypeRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Config\FormStep\FormStepUserTypeService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class FormStepUserTypeController extends Controller
{
    /**
     * @var FormStepUserTypeService
     */
    private $service;

    public function __construct(FormStepUserTypeService $service)
    {
        $this->service = $service;
    }

    public function findByUserType($userTypeId)
    {
        try {
            $result = $this->service
                ->findByUserType($userTypeId);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "erro ao buscar os documentos por tipos de usuarios");
        }

        return ApiResponse::success($result);
    }

    public function insert(FormStepUserTypeRequest $request)
    {
        try {
            $result = $this->service
                ->insert($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir campo no tipo de motorista");
        }

        return ApiResponse::created($result);
    }

    public function delete($id)
    {
        try {
            $result = $this->service
                ->delete($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao remover campo de tipo de motorista");
        }

        return ApiResponse::success($result);
    }
}
