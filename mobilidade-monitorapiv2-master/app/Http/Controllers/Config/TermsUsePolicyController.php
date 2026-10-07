<?php


namespace App\Http\Controllers\Config;


use App\Http\Controllers\Controller;
use App\Http\Requests\Config\TermsUsePolicyRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Config\TermsUsePolicyService;
use Illuminate\Http\Request;

class TermsUsePolicyController extends Controller
{
    private $service;

    /**
     * TermsUsePolicyController constructor.
     * @param TermsUsePolicyService $service
     */
    public function __construct(TermsUsePolicyService $service)
    {
        $this->service = $service;
    }

    public function findAll()
    {
        try {
            $data = $this->service->all();
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage());
        }

        return ApiResponse::success($data);
    }

    public function findByType(Request $request)
    {
        try {
            $data = $this->service->findByType($request->type);
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage());
        }

        return ApiResponse::success($data);
    }

    public function store(TermsUsePolicyRequest $request)
    {
        try {
            $data = $this->service->store($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage());
        }

        return ApiResponse::created($data);
    }


    public function update(TermsUsePolicyRequest $request)
    {
        try {
            $data = $this->service->update($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage());
        }

        return ApiResponse::success($data);
    }
}
