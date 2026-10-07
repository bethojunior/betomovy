<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\ProfilePhotoUploadRequest;
use App\Http\Responses\ApiResponse;
use App\Services\User\CustomerProfilePhotoService;

class CustomerProfilePhotoController extends Controller
{
    /**
     * @var CustomerProfilePhotoService
     */
    private $service;

    public function __construct(CustomerProfilePhotoService $service)
    {
        $this->service = $service;
    }

    public function upload($customerId, ProfilePhotoUploadRequest $request)
    {
        try {
            $result = $this->service
                ->uploadProfilePhoto($customerId, $request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao enviar foto de perfil do cliente");
        }

        return ApiResponse::success($result);
    }
}
