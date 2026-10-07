<?php

namespace App\Http\Controllers\Enum;

use App\Http\Responses\ApiResponse;
use App\Services\Enum\WeekDayService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class WeekDayController extends Controller
{
    /**
     * @var WeekDayService
     */
    private $service;

    public function __construct(WeekDayService $service)
    {
        $this->service = $service;
    }

    public function all()
    {
        try {
            $result = $this->service
                ->findAll();
        } catch (\Exception $e) {
            return ApiResponse::error($e, 'Erro ao buscar os dias da semana');
        }

        return ApiResponse::success($result);
    }
}
