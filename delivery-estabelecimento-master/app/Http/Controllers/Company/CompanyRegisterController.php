<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Http\Requests\Company\CompanyPreRegisterRequest;
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
            return redirect()
                ->back()
                ->withErrors(['error' => $e->getMessage()])
                ->withInput();
        }

        alert('Parabéns!', 'Logo estaremos em contato com você para ativar o seu acesso', 'success');

        return redirect()
            ->route('welcome')
            ->with(['message' => 'Estabelecimento cadastrado com sucesso!']);
    }
}
