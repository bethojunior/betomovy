<?php


namespace App\Http\Controllers\App;


use App\Http\Controllers\Controller;
use App\Http\Requests\App\AppAnimationRequest;
use App\Http\Responses\ApiResponse;
use App\Services\App\AppAnimationService;

class AppAnimationController extends Controller
{
    private $service;

    public function __construct(AppAnimationService $service)
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


    public function update(AppAnimationRequest $request)
    {
        try {
            $request = $request->validated();
            return ApiResponse::success($this->service
                ->update($request));
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao atualizar animação");
        }
    }

}
