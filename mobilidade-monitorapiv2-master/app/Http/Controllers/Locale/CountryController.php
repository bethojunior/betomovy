<?php

namespace App\Http\Controllers\Locale;

use App\Http\Controllers\Controller;
use App\Http\Requests\Locale\CountryRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Locale\Country;
use App\Services\Locale\CountryService;
use Illuminate\Http\Request;

class CountryController extends Controller
{
    private $service;

    /**
     * CountryController constructor.
     * @param CountryService $service
     */
    public function __construct(CountryService $service)
    {
        $this->service = $service;
    }

    public function findAll(Request $request)
    {
        $query = $request->query->get('q');

        try {
            $data = $this->service->findAll($query);
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function find($id)
    {
        try {
            $data = $this->service->find($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function store(CountryRequest $request)
    {
        try {
            $data = $this->service->store($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }

    public function update(int $id, CountryRequest $request)
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
