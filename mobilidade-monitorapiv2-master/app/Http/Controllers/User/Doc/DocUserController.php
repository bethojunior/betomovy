<?php

namespace App\Http\Controllers\User\Doc;

use App\Http\Requests\User\Doc\DocUserImageRequest;
use App\Http\Requests\User\Doc\DocUserRequest;
use App\Http\Requests\User\Doc\UserDocRequest;
use App\Http\Responses\ApiResponse;
use App\Services\User\Doc\DocUserService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class DocUserController extends Controller
{
    /**
     * @var DocUserService
     */
    private $service;

    public function __construct(DocUserService $service)
    {
        $this->service = $service;
    }

    public function insert(DocUserRequest $request)
    {
        try {
            $result = $this->service
                ->insert($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao solicitar documento ao usuario");
        }

        return ApiResponse::created($result);
    }

    public function uploadImage($id, DocUserImageRequest $request)
    {
        try {
            $result = $this->service
                ->uploadImage($id, $request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao enviar imagem do documento");
        }

        return ApiResponse::success($result);
    }

    public function delete($id)
    {
        try {
            $result = $this->service
                ->delete($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao excluir status do documento do usuario");
        }

        return ApiResponse::success($result);
    }

    public function findByUser($userId)
    {
        try {
            $result = $this->service
                ->findByUser($userId);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar documentos do usuario");
        }

        return ApiResponse::success($result);
    }

    public function updateStatus($id, Request $request)
    {
        try {
            $result = $this->service
                ->updateStatus($id, $request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar status do documento do usuario");
        }

        return ApiResponse::success($result);
    }
}
