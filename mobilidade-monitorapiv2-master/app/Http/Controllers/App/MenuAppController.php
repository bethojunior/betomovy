<?php


namespace App\Http\Controllers\App;


use App\Http\Controllers\Controller;
use App\Http\Requests\App\MenuAppRequest;
use App\Http\Responses\ApiResponse;
use App\Services\App\MenuAppService;
use Illuminate\Http\Request;

class MenuAppController extends Controller
{
    private $service;

    public function __construct(MenuAppService $service)
    {
        $this->service = $service;
    }

    public function insert(MenuAppRequest $request)
    {
        try {
            $data = $this->service->insert($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function insertPro(Request $request)
    {
        try {
            $data = $this->service->insertPro($request);
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function findActives()
    {
        try {
            $result = $this->service->findActives();
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($result);
    }

    public function findActivesPro()
    {
        try {
            $result = $this->service->findActivesPro();
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($result);
    }

    public function disable(int $id)
    {
        try {
            $result = $this->service->disableMenuApp($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($result);
    }

}
