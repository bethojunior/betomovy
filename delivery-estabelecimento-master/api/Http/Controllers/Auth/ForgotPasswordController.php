<?php


namespace Api\Http\Controllers\Auth;


use Api\Http\Responses\ApiResponse;
use Api\Services\Auth\ForgotPasswordService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ForgotPasswordController extends Controller
{
    private $service;

    public function __construct(ForgotPasswordService $service)
    {
        $this->service = $service;
    }

    public function sendVerificationCodeEmail(Request $request): JsonResponse
    {
        try {
            if (!$request->has('email')) throw new \Exception('E-mail é obrigatório');
            $data = $this->service->sendVerificationCodeEmail($request->email);
        } catch (\Exception $e) {
            return ApiResponse::error($e);
        }

        return ApiResponse::success($data);
    }
}
