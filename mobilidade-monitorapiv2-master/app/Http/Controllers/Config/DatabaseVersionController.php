<?php


namespace App\Http\Controllers\Config;


use App\Http\Responses\ApiResponse;
use App\Services\Config\DatabaseVersionService;

class DatabaseVersionController
{
    private $service;

    /**
     * DatabaseVersionController constructor.
     * @param DatabaseVersionService $service
     */
    public function __construct(DatabaseVersionService $service)
    {
        $this->service = $service;
    }


    public function get()
    {
        try {
            $data = $this->service->get();
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage());
        }

        return ApiResponse::success($data);
    }
}
