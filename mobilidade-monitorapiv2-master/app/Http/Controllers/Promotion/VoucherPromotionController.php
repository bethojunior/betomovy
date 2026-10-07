<?php


namespace App\Http\Controllers\Promotion;


use App\Http\Requests\Promotion\VoucherPromotionRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Promotion\VoucherPromotionService;
use Illuminate\Http\Request;

class VoucherPromotionController
{
    private $service;

    public function __construct(VoucherPromotionService $service)
    {
        $this->service = $service;
    }

    public function findAll(Request $request)
    {
        try {
            $data = $this->service->findAll($request->query->all());
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

    public function save(VoucherPromotionRequest $request)
    {
        try {
            $data = $this->service->save($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::created($data);
    }

    public function update(int $id, VoucherPromotionRequest $request)
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
