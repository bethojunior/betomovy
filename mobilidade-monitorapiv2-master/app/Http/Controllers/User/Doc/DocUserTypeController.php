<?php

namespace App\Http\Controllers\User\Doc;

use App\Http\Requests\User\Doc\DocUserTypeRequest;
use App\Http\Responses\ApiResponse;
use App\Services\User\Doc\DocUserTypeService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class DocUserTypeController extends Controller
{
    /**
     * @var DocUserTypeService
     */
    private $service;

    public function __construct(DocUserTypeService $service)
    {
        $this->service = $service;
    }

    public function findAll($userTypeId)
    {
        try {
            $result = $this->service
                ->allByUserType($userTypeId);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar os documentos por tipo de usuario");
        }

        return ApiResponse::success($result);
    }

    public function insert($userTypeId, DocUserTypeRequest $request)
    {
        try {
            $result = $this->service
                ->insert($userTypeId, $request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir documento no tipo de motorista");
        }

        return ApiResponse::created($result);
    }

    public function delete($id)
    {
        try {
            $result = $this->service
                ->delete($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao deletar documento");
        }

        return ApiResponse::success($result);
    }
}
