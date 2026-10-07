<?php

namespace App\Http\Controllers\Company;

use App\Http\Requests\Company\CompanyVoucherRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Company\CompanyVoucherService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CompanyVoucherController extends Controller
{
    /**
     * @var CompanyVoucherService
     */
    private $service;

    public function __construct(CompanyVoucherService $service)
    {
        $this->service = $service;
    }

    public function changeBalance($companyId, $action, CompanyVoucherRequest $request)
    {
        try {
            $result = $this->service
                ->change($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao alterar saldo da empresa");
        }

        return ApiResponse::success($result);
    }
}
