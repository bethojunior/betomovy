<?php

namespace App\Http\Controllers\Trip;

use App\Http\Controllers\Controller;
use App\Http\Requests\Trip\TaxRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Trip\TaxService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaxController extends Controller
{
    private $service;

    public function __construct(TaxService $service)
    {
        $this->service = $service;
    }


    public function findAll(Request $request): JsonResponse
    {
        try {
            $data = $this->service->findAll($request->query->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function store(TaxRequest $request): JsonResponse
    {
        try {
            $data = $this->service->store($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::created($data);
    }

    public function update(int $id, TaxRequest $request): JsonResponse
    {
        try {
            $data = $this->service->update($id, $request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function active(int $id, Request $request): JsonResponse
    {
        try {
            if (!isset($request->active)) {
                throw new \Exception('O valor active é requerido');
            }
            if (!is_bool($request->active)) {
                throw new \Exception('O valor active é inválido');
            }

            $data = $this->service->active($id, $request->active);
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function delete(int $id): JsonResponse
    {
        try {
            $data = $this->service->delete($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }
}
