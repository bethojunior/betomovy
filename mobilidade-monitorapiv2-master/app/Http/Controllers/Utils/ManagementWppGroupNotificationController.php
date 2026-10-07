<?php


namespace App\Http\Controllers\Utils;


use App\Http\Controllers\Controller;
use App\Http\Requests\Utils\ManagementWppGroupNotificationRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Utils\ManagementWppGroupNotificationService;
use Illuminate\Http\Request;

class ManagementWppGroupNotificationController extends Controller
{
    private $service;

    public function __construct(ManagementWppGroupNotificationService $service)
    {
        $this->service = $service;
    }


    public function findAll(Request $request)
    {
        try {
            $request->validate(['reference' => 'sometimes|string']);
            $data = $this->service->findAll($request->query('reference'));
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function find(int $id)
    {
        try {
            $data = $this->service->find($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function store(ManagementWppGroupNotificationRequest $request)
    {
        try {
            $data = $this->service->store($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function update(ManagementWppGroupNotificationRequest $request, int $id)
    {
        try {
            $data = $this->service->update($id, $request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function delete(int $id)
    {
        try {
            $data = $this->service->delete($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }
}
