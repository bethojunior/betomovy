<?php


namespace App\Http\Controllers\Driver;


use App\Http\Controllers\Controller;
use App\Http\Requests\Driver\IconMapDriverRequest;
use App\Http\Responses\ApiResponse;
use App\Models\User\Driver\IconMapDriver;
use App\Services\Driver\IconMapDriverService;

class IconMapDriverController extends Controller
{
    private $service;

    /**
     * IconMapDriverController constructor.
     * @param IconMapDriverService $service
     */
    public function __construct(IconMapDriverService $service)
    {
        $this->service = $service;
    }

    public function findAll()
    {
        try {
            $data = $this->service->findAll();
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage());
        }

        return ApiResponse::success($data);
    }

    public function find(int $id)
    {
        try {
            $data = $this->service->find($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage());
        }

        return ApiResponse::success($data);
    }

    public function store(IconMapDriverRequest $request)
    {
        try {
            $data = $this->service->store($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage());
        }

        return ApiResponse::success($data);
    }

    public function update(IconMapDriver $iconMapDriver, IconMapDriverRequest $request)
    {
        try {
            $data = $this->service->update($iconMapDriver, $request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage());
        }

        return ApiResponse::success($data);
    }

    public function delete(IconMapDriver $iconMapDriver)
    {
        try {
            $data = $this->service->delete($iconMapDriver);
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage());
        }

        return ApiResponse::success($data);
    }
}
