<?php


namespace App\Http\Controllers\Driver;


use App\Http\Controllers\Controller;
use App\Http\Requests\Driver\CarRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Driver\CarService;

class CarController extends Controller
{
    /** @var CarService */
    private $service;

    /**
     * CarController constructor.
     * @param CarService $service
     */
    public function __construct(CarService $service)
    {
        $this->service = $service;
    }

    public function edit(int $id, CarRequest $request)
    {
        try {
            $data = $this->service->edit($id, $request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function getPendingCars($cityId = null)
    {
        try {
            $data = $this->service->getPendingCars($cityId);
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function acceptCar(CarRequest $request)
    {
        try {
            $data = $this->service->acceptCar($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function rejectCar(CarRequest $request)
    {
        try {
            $data = $this->service->rejectCar($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }
}
