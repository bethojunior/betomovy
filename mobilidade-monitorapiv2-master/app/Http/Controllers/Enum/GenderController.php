<?php

namespace App\Http\Controllers\Enum;

use App\Http\Responses\ApiResponse;
use App\Services\Enum\GenderService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class GenderController extends Controller
{
    /**
     * @var GenderService
     */
    private $service;

    public function __construct(GenderService $service)
    {
        $this->service = $service;
    }

    public function all()
    {
        try {
            $result = $this->service
                ->findAll();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar os generos");
        }

        return ApiResponse::success($result);
    }
}
