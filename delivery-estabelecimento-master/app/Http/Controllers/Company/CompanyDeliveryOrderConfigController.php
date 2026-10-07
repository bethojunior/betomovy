<?php


namespace App\Http\Controllers\Company;


use App\Http\Controllers\Controller;
use App\Http\Requests\Company\CompanyDeliveryConfigAverageDeliveryTimeRequest;
use App\Http\Requests\Company\CompanyDeliveryConfigCallForAllRequest;
use App\Http\Requests\Company\CompanyDeliveryConfigMinPriceRequest;
use App\Services\Company\CompanyDeliveryOrderConfigService;

class CompanyDeliveryOrderConfigController extends Controller
{
    /**
     * @var CompanyDeliveryOrderConfigService
     */
    private $service;

    public function __construct(CompanyDeliveryOrderConfigService $service)
    {
        $this->service = $service;
    }

    public function updateMinPrice(CompanyDeliveryConfigMinPriceRequest $request)
    {
        try {
            $this->service
                ->updateMinPrice($request->validated());

            toast('Preço mínimo do pedido atualizado com sucesso', 'success');
        } catch (\Exception $e) {
            toast('Erro ao atualizar preço mínimo', 'error');
        }

        return redirect()
            ->back();
    }

    public function updateAverageDeliveryTime(CompanyDeliveryConfigAverageDeliveryTimeRequest $request)
    {
        try {
            $this->service
                ->updateAverageDeliveryTime($request->validated());

            toast('Tempo médio de entrega atualizado com sucesso', 'success');
        } catch (\Exception $e) {
            toast('Erro ao atualizar tempo médio de entrega', 'error');
        }

        return redirect()
            ->back();
    }

    public function updateCalledMode(CompanyDeliveryConfigCallForAllRequest $request)
    {
        try {
            $this->service
                ->updateCalledMode($request->validated());

            toast('Modo de chamado atualizado com sucesso', 'success');
        } catch (\Exception $e) {
            toast('Erro ao atualizar modo de chamado', 'error');
        }

        return redirect()
            ->back();
    }

}
