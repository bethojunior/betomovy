<?php

namespace App\Http\Controllers\Accessibility;

use App\Http\Requests\Freight\Accessibility\AccessibilityHelpRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Freight\Accessibility\AccessibilityHelpService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class AccessibilityHelpController extends Controller
{
    /**
     * @var AccessibilityHelpService
     */
    private $service;

    public function __construct(AccessibilityHelpService $service)
    {
        $this->service = $service;
    }

    public function insert(AccessibilityHelpRequest $request)
    {
        try {
            $result = $this->service
                ->insert($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir ajudante");
        }

        return ApiResponse::created($result, "Ajudante criado com sucesso");
    }

    public function findAll()
    {
        try {
            $result = $this->service
                ->findAll();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar os ajudantes");
        }

        return ApiResponse::success($result);
    }

    public function delete($id)
    {
        try {
            $result = $this->service
                ->delete($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao excluir ajudante");
        }

        return ApiResponse::success($result, "Excluído com sucesso");
    }
}
