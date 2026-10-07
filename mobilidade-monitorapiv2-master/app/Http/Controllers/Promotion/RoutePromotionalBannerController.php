<?php


namespace App\Http\Controllers\Promotion;


use App\Http\Controllers\Controller;
use App\Http\Requests\Promotion\RoutePromotionalBannerRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Promotion\RoutePromotionalBannerService;
use Google\Protobuf\Api;

class RoutePromotionalBannerController extends Controller
{
    private $service;

    public function __construct(RoutePromotionalBannerService $service)
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

    public function save(RoutePromotionalBannerRequest $request)
    {
        try {
            $data = $this->service->save($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::created($data);
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
