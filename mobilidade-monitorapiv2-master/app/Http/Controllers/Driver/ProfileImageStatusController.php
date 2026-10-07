<?php

namespace App\Http\Controllers\Driver;

use App\Http\Responses\ApiResponse;
use App\Services\Driver\UpdateProfileImageService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ProfileImageStatusController extends Controller
{
    /**
     * @var UpdateProfileImageService
     */
    private $service;

    public function __construct(UpdateProfileImageService $service)
    {
        $this->service = $service;
    }

    public function requestNewPicture($driverId, Request $request)
    {
        try {
            $result = $this->service
                ->requestNewPicture($request->all(), $driverId);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao solicitar foto do perfil novamente");
        }

        return ApiResponse::success($result);
    }
}
