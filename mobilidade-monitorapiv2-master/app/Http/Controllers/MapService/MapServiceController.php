<?php


namespace App\Http\Controllers\MapService;


use App\Http\Controllers\Controller;
use App\Http\Requests\MapService\MapServiceRequest;
use App\Http\Responses\ApiResponse;
use App\Services\MapService\MapServiceService;
use Illuminate\Http\Request;

class MapServiceController extends Controller
{
    private $service;

    public function __construct(MapServiceService $service)
    {
        $this->service = $service;
    }

    public function findAll(Request $request)
    {
        try {
            if (!$request->header('cityid')) throw new \Exception('Cidade não especificada');
            $data = $this->service->findAll($request->header('cityid'));
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function findWithMetaData()
    {
        try {
            $data = $this->service->findWithMetaData();
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function store(MapServiceRequest $request)
    {
        try {
            if (!$request->header('cityid')) throw new \Exception('Cidade não especificada');

            $data = $this->service->store($request->validated(), $request->header('cityid'));
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::created($data);
    }

    public function disableByGroup($groupCode)
    {
        try {
            $this->service->disableByGroup($groupCode);
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success(null);
    }
}
