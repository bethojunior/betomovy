<?php

namespace App\Http\Controllers\Config\FormStep;

use App\Http\Responses\ApiResponse;
use App\Services\Config\FormStep\FormStepService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class FormStepController extends Controller
{
    /**
     * @var FormStepService
     */
    private $service;

    public function __construct(FormStepService $service)
    {
        $this->service = $service;
    }

    public function all()
    {
        try {
            $result = $this->service->findAll();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar os passos de formulario");
        }

        return ApiResponse::success($result);
    }
}
