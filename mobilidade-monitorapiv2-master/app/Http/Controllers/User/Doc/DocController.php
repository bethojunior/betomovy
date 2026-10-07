<?php

namespace App\Http\Controllers\User\Doc;

use App\Http\Requests\User\Doc\DocRequest;
use App\Http\Requests\User\Doc\UpdateDocRequest;
use App\Http\Responses\ApiResponse;
use App\Services\User\Doc\DocService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class DocController extends Controller
{
    /**
     * @var DocService
     */
    private $service;

    public function __construct(DocService $service)
    {
        $this->service = $service;
    }

    public function all()
    {
        try {
            $result = $this->service->findAll();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar os tipos de documentos");
        }

        return ApiResponse::success($result);
    }

    public function insert(DocRequest $request)
    {
        try {
            $result = $this->service
                ->insert($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao inserir o documento');
        }

        return ApiResponse::created($result);
    }

    public function update($id, UpdateDocRequest $request)
    {
        try {
            $result = $this->service
                ->update($id, $request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar o documento");
        }

        return ApiResponse::success($result);
    }

    public function delete($id)
    {
        try {
            $result = $this->service
                ->delete($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao excluir um documento");
        }

        return ApiResponse::success($result);
    }
}
