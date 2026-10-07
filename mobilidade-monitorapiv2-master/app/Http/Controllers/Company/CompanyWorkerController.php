<?php

namespace App\Http\Controllers\Company;

use App\Http\Requests\Company\CompanyWorker\CompanyWorkerRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Company\CompanyWorkerService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CompanyWorkerController extends Controller
{
    /**
     * @var CompanyWorkerService
     */
    private $service;

    public function __construct(CompanyWorkerService $service)
    {
        $this->service = $service;
    }

    public function add(CompanyWorkerRequest $request)
    {
        try {
            $result = $this->service
                ->add($request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao adicionar um funcionario a pessoa juridica");
        }

        return ApiResponse::created($result);
    }

    public function delete($id)
    {
        try {
            $result = $this->service
                ->delete($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao excluir um funcionario da pessoa juridica");
        }

        return ApiResponse::success($result);
    }
}
