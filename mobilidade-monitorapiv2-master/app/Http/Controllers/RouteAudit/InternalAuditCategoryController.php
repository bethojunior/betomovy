<?php


namespace App\Http\Controllers\RouteAudit;


use App\Http\Controllers\Controller;
use App\Http\Requests\RouteAudit\InternalAuditCategoryRequest;
use App\Http\Responses\ApiResponse;
use App\Models\RouteAudit\InternalAuditCategory;
use App\Services\RouteAudit\InternalAuditCategoryService;
use Illuminate\Http\Request;

class InternalAuditCategoryController extends Controller
{
    private $service;

    public function __construct(InternalAuditCategoryService $service)
    {
        $this->service = $service;
    }

    public function findAll()
    {
        try {
            $data = $this->service->findAll();
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

    public function save(InternalAuditCategoryRequest $request)
    {
        try {
            $data = $this->service->save($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::created($data);
    }

    public function update(InternalAuditCategory $internalAuditCategory, InternalAuditCategoryRequest $request)
    {
        try {
            $data = $this->service->update($internalAuditCategory, $request->validated());
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

    public function findRequestsByCategory(int $id, Request $request)
    {
        try {
            $data = $this->service->findRequestsByCategory($id, $request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }
}
