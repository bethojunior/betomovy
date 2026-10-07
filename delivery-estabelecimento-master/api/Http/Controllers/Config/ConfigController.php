<?php


namespace Api\Http\Controllers\Config;


use Api\Http\Responses\ApiResponse;
use Api\Services\Config\ConfigService;
use App\Http\Controllers\Controller;

class ConfigController extends Controller
{
    private $service;

    public function __construct(ConfigService $service)
    {
        $this->service = $service;
    }

    public function findKeyMapbox()
    {
        try {
            $result = $this->service->findKeyMapbox();
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($result);
    }
}
