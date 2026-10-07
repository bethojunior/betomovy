<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\ProfilePhotoUploadRequest;
use App\Http\Responses\ApiResponse;
use App\Services\Driver\DriverProfilePhotoService;

class ProfilePhotoController extends Controller
{
    /**
     * @var DriverProfilePhotoService
     */
    private $service;

    public function __construct(DriverProfilePhotoService $service)
    {
        $this->service = $service;
    }

    public function upload($driverId, ProfilePhotoUploadRequest $request)
    {
        try {
            $result = $this->service
                ->uploadProfilePhoto($driverId, $request->all());
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao enviar foto de perfil do motorista");
        }

        return ApiResponse::success($result);
    }
}
