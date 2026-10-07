<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Http\Requests\Company\CompanyPreRegisterRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Company\CompanyRegisterService;
use Illuminate\Http\Request;

class CompanyRegisterController extends Controller
{
    /**
     * @var CompanyRegisterService
     */
    private $service;

    public function __construct(CompanyRegisterService $service)
    {
        $this->service = $service;
    }

    public function preRegister(CompanyPreRegisterRequest $request)
    {
        try {
            $this->service
                ->preRegister($request->validated());
        } catch (\Throwable $e) {
            return ApiResponse::error($e,"Ero ao fazer cadastro");
        }
        return ApiResponse::success(null,"Estabelecimento cadastrado com sucesso!");
    }
}
