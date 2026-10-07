<?php

namespace App\Http\Controllers\Central;

use App\Http\Controllers\Controller;
use App\Http\Requests\Central\CentralFeeRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Central\CentralFeeService;

class CentralFeeController extends Controller
{
    private $service;

    public function __construct(CentralFeeService $service)
    {
        $this->service = $service;
    }

    public function store(CentralFeeRequest $request)
    {
        try {
            $data = $this->service->store($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function find()
    {
        try {
            $data = $this->service->find();
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

}
