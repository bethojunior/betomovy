<?php

namespace App\Http\Controllers\Platform;

use App\Http\Responses\ApiResponse;
use App\Services\Platform\AppService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class AppController extends Controller
{
    /**
     * @var AppService
     */
    private $service;

    public function __construct(AppService $service)
    {
        $this->service = $service;
    }

    public function all()
    {
        try {
            $result = $this->service
                ->findAll();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar as plataformas disponíveis");
        }

        return ApiResponse::success($result);
    }
}
