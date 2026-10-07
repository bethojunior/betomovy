<?php


namespace App\Http\Controllers\App;


use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\App\MenuAppTypeService;

class MenuAppTypeController extends Controller
{
    private $service;

    public function __construct(MenuAppTypeService $service)
    {
        $this->service = $service;
    }

    public function findAll()
    {
        try {
            $result = $this->service->findAll();
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($result);
    }
}
