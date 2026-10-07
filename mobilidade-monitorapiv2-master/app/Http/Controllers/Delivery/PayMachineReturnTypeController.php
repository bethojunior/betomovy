<?php


namespace App\Http\Controllers\Delivery;


use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\Delivery\PayMachineReturnTypeService;

class PayMachineReturnTypeController extends Controller
{
    private $service;

    public function __construct(PayMachineReturnTypeService $service)
    {
        $this->service = $service;
    }

    public function findAll()
    {
        try {
            $result = $this->service
                ->findAll();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar tipos de taxa de retorno");
        }

        return ApiResponse::created($result, "Tipos de taxa de retorno");
    }
}
