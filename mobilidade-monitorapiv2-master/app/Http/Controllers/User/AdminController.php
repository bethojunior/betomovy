<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\Admin\AdminRequest;
use App\Http\Responses\ApiResponse;
use App\Services\User\AdminService;
use Illuminate\Http\JsonResponse;

class AdminController extends Controller
{
    /**
     * @var AdminService
     */
    private $service;

    public function __construct(AdminService $service)
    {
        $this->service = $service;
    }

    public function index(): JsonResponse
    {
        return ApiResponse::success($this->service->findAll());
    }

    public function store(AdminRequest $request): JsonResponse
    {
        return ApiResponse::created($this->service->store($request->validated()));
    }

    public function show($id): JsonResponse
    {
        return ApiResponse::success($this->service->findById($id));
    }

    public function update($id, AdminRequest $request): JsonResponse
    {
        return ApiResponse::success($this->service->update($id, $request->validated()));
    }

    public function getBills($customerName) {
        try {
            $data = $this->service->getBills($customerName);
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage());
        }

        return ApiResponse::success($data);
    }
}
