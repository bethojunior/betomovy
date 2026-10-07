<?php

namespace App\Http\Controllers\User;

use App\Http\Requests\User\AuthenticationRequest;
use App\Http\Responses\ApiResponse;
use App\Services\User\AuthenticationService;
use App\Http\Controllers\Controller;

class AuthenticationController extends Controller
{
    /**
     * @var AuthenticationService
     */
    private $service;

    public function __construct(AuthenticationService $service)
    {
        $this->service = $service;
    }

    public function authentication(AuthenticationRequest $request)
    {
        try {
            $user = $this->service
                ->authenticate($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao efetuar login');
        }

        return ApiResponse::success($user, "Login efetuado com sucesso");
    }

    public function authenticationCompany(AuthenticationRequest $request)
    {
        try {
            $user = $this->service
                ->authenticateCompany($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao efetuar login');
        }

        return ApiResponse::success($user, "Login efetuado com sucesso");
    }
}
