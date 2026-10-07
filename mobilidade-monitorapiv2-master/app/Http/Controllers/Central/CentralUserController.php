<?php

namespace App\Http\Controllers\Central;

use App\Http\Controllers\Controller;
use App\Http\Requests\Central\InsertCentralUserRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Central\CentralUserService;
use Illuminate\Http\Request;

class CentralUserController extends Controller
{
    /**
     * @var CentralUserService
     */
    private $service;

    public function __construct(CentralUserService $service)
    {
        $this->service = $service;
    }

    public function insertUser(InsertCentralUserRequest $request)
    {
        try {
            $result = $this->service->insertUser($request->validated());
            return ApiResponse::success($result,"Usuário inserido na central com sucesso");
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao inserir Usuário na Central");
        }
    }

    public function findUsersByCentral(int $centralId)
    {
        try {
            $result = $this->service->findUsersByCentral($centralId);
            return ApiResponse::success($result);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao listar usuários da central");
        }
    }

    public function eligible(Request $request)
    {
        try {
            $result = $this->service->eligible($request->query('search'), (int) $request->query('page', 1));
            return ApiResponse::success($result);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar usuários elegíveis");
        }
    }
}
