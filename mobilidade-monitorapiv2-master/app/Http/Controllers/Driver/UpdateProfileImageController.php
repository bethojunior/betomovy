<?php

namespace App\Http\Controllers\Driver;

use App\Http\Responses\ApiResponse;
use App\Services\Driver\UpdateProfileImageService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class UpdateProfileImageController extends Controller
{
    /**
     * @var UpdateProfileImageService
     */
    private $service;

    public function __construct(UpdateProfileImageService $service)
    {
        $this->service = $service;
    }

    public function authorizeImage($driverId)
    {
        try {
            $result = $this->service
                ->authorize($driverId);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao autorizar foto do motorista");
        }

        return ApiResponse::success($result, "Foto do motorista autorizada");
    }

    public function deny($driverId)
    {
        try {
            $result = $this->service
                ->deny($driverId);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao recusar foto do motorista");
        }

        return ApiResponse::success($result, "Foto do motorista negada com sucesso");
    }
}
