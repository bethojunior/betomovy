<?php

namespace App\Http\Controllers\User;

use App\Http\Responses\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\auth\RegisterUserRoutePublic;
use App\Services\User\UserService;
use Illuminate\Http\Request;

class UserController extends Controller
{
    private $service;

    public function __construct(UserService $service)
    {
        $this->service = $service;
    }

    public function setPassword(int $id, Request $request)
    {
        try {
            if (!$request->has('password')) throw new \Exception("Nova senha não enviada");
            if (!$request->has('code')) throw new \Exception("Código de verificação não enviado");

            $result = $this->service->setPassword($id, $request->password, $request->code);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao salvar senha");
        }

        return ApiResponse::success($result, 'Senha alterada com sucesso');
    }

    public function forgetPassword(Request $request)
    {
        try {
            if (!$request->has('email')) throw new \Exception('e-mail não enviado');
            $users = $this->service->forgetPassword($request->email);
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($users);
    }

    public function findWithCustomer($id)
    {
        try {
            $user = $this->service->find($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($user);
    }

    public function registerBySite(RegisterUserRoutePublic $request)
    {
        try {
            $user = $this->service->registerBySiteForWhatsApp($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }
        return ApiResponse::success($user);
    }
}
