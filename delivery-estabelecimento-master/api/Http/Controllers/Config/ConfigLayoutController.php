<?php

namespace Api\Http\Controllers\Config;

use Api\Http\Responses\ApiResponse;
use Api\Services\Config\ConfigLayoutService;
use App\Http\Controllers\Controller;

class ConfigLayoutController extends Controller
{
    private $service;

    public function __construct(ConfigLayoutService $service)
    {
        $this->service = $service;
    }

    public function get()
    {
        try {
            $result = $this->service->findLayout();
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($result);
    }
}
