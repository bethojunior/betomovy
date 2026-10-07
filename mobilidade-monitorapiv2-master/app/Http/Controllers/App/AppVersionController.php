<?php


namespace App\Http\Controllers\App;


use App\Http\Controllers\Controller;
use App\Http\Requests\App\AppVersionRequest;
use App\Http\Requests\App\NewAppVersionRequest;
use App\Http\Responses\ApiResponse;
use App\Services\App\AppVersionService;
use Illuminate\Http\JsonResponse;

class AppVersionController extends Controller
{
    private $service;

    public function __construct(AppVersionService $service)
    {
        $this->service = $service;
    }

    public function index(): JsonResponse
    {
        return ApiResponse::success($this->service->getAll());
    }

    public function store(NewAppVersionRequest $request): JsonResponse
    {
        return ApiResponse::created($this->service->store($request->validated()));
    }

    public function update(int $id, AppVersionRequest $request): JsonResponse
    {
        try {
            $data = $this->service->update($id, $request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function getAll(){
        try {
            $data = $this->service->getVersionsFromAna();
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }
    
    public function getAnaVersionById(int $id){
        try {
            $data = $this->service->getVersionByIdAna($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }
}
