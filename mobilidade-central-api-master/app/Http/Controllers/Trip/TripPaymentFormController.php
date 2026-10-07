<?php

namespace App\Http\Controllers\Trip;

use App\Http\Responses\ApiResponse;
use App\Services\Trip\TripPaymentFormService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class TripPaymentFormController extends Controller
{
    /**
     * @var TripPaymentFormService
     */
    private $service;

    public function __construct(TripPaymentFormService $service)
    {
        $this->service = $service;
    }

    public function all()
    {
        try {
            $tripPaymentForms = $this->service
                ->findAll();
        } catch (\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], "Erro ao buscar as formas de pagamento");
        }

        return ApiResponse::success($tripPaymentForms, "Formas de pagamento encontradas");
    }
}
