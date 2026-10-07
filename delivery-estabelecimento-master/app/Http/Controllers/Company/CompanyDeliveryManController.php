<?php


namespace App\Http\Controllers\Company;


use App\Http\Controllers\Controller;
use App\Http\Requests\Company\CompanyDeliveryManRequest;
use App\Services\Company\CompanyDeliveryManService;

class CompanyDeliveryManController extends Controller
{
    private $service;

    public function __construct(CompanyDeliveryManService $service)
    {
        $this->service = $service;
    }

    public function store(CompanyDeliveryManRequest $request)
    {
        try {
            $this->service
                ->store($request->validated());

            toast('Entregador vinculado com sucesso', 'success');
        } catch (\Exception $e) {
            toast($e->getMessage(), 'error');
        }

        return redirect()
            ->back();
    }


    public function delete($id)
    {
        try {
            $this->service
               ->delete($id);

            toast('Entregador desvinculado com sucesso', 'success');
        } catch (\Exception $e) {
            toast($e->getMessage(), 'error');
        }

        return redirect()
            ->back();
    }
}
