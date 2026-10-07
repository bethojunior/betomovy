<?php


namespace Api\Http\Controllers\Notification;


use Api\Http\Requests\Notification\CompanyDeliveryTokensRequest;
use Api\Http\Responses\ApiResponse;
use Api\Services\Notification\CompanyNotificationService;
use App\Http\Controllers\Controller;

class CompanyNotificationController extends Controller
{
    private $service;

    public function __construct(CompanyNotificationService $service)
    {
        $this->service = $service;
    }

    public function registerToken(CompanyDeliveryTokensRequest $request)
    {
        try {
            $this->service->registerToken($request->validated());
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success(null, "Registrado com sucesso!");
    }
}
