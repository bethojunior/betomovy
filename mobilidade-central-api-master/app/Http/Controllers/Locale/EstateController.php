<?php

namespace App\Http\Controllers\Locale;

use App\Http\Responses\ApiResponse;
use App\Services\Locale\EstateService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class EstateController extends Controller
{
    /**
     * @var EstateService
     */
    private $service;

    public function __construct(EstateService $service)
    {
        $this->service = $service;
    }

    public function all()
    {
        try {
            $estates = $this->service->all();
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], "Erro ao buscar os estados");
        }

        return ApiResponse::success($estates, "Estados encontrados");
    }
}
