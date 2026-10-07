<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Http\Requests\Driver\UpdateDriverBankAccountRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Driver\DriverBankAccountPolicy;
use App\Services\Driver\DriverBankAccountService;
use Illuminate\Support\Facades\Auth;

class DriverBankAccountController extends Controller
{
    private $service;

    private $policy;

    public function __construct(DriverBankAccountService $service, DriverBankAccountPolicy $policy)
    {
        $this->service = $service;
        $this->policy = $policy;
    }

    public function update(int $driverId, UpdateDriverBankAccountRequest $request)
    {
        if (!$this->policy->canEdit(Auth::user())) {
            return ApiResponse::error(null, 'Sem permissão para editar dados bancários.', 403);
        }

        try {
            $bankAccountId = $this->service->update($driverId, $request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao atualizar dados bancários do motorista');
        }

        return ApiResponse::success(['bankAccountId' => $bankAccountId], 'Dados bancários atualizados');
    }
}
