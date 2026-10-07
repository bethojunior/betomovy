<?php


namespace App\Http\Controllers\App;


use App\Http\Controllers\Controller;
use App\Http\Requests\App\AppModuleRequest;
use App\Http\Responses\ApiResponse;
use App\Services\App\AppModuleService;

class AppModuleController extends Controller
{
    private $service;

    public function __construct(AppModuleService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        try {
            $data = $this->service->getAll();
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        } 

        return ApiResponse::success($data);
    }

    public function update(AppModuleRequest $request)
    {
        try {
            $data = $this->service->updateStatus($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data, "Sucesso ao atualizar modulo");
    }
}