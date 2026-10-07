<?php


namespace App\Http\Controllers\Config;


use App\Http\Responses\ApiResponse;
use App\Services\Config\PaymentFormTypeService;
use Illuminate\Routing\Controller;

class PaymentFormTypeController extends Controller
{
    private $service;

    public function __construct(PaymentFormTypeService $service)
    {
        $this->service = $service;
    }

    public function findShowable()
    {
           try{
               $result= $this->service
                   ->findShowable();

           }catch(\Exception $e) {
            return ApiResponse::error([
                $e->getMessage()
            ], "Erro ao buscar a forma de pagamento ");
        }

        return ApiResponse::success($result, "Forma de pagamento encontrado");
    }

    public function findOnlyGeneral()
    {
        try {
            $result = $this->service
                ->findOnlyGeneral();
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao buscar tipos de formas de pagamento gerais");
        }

        return ApiResponse::success($result);
    }
}
