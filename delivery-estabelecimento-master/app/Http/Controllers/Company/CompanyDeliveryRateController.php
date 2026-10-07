<?php


namespace App\Http\Controllers\Company;


use App\Http\Requests\Company\CompanyDeliveryRateRequest;
use App\Models\Company\CompanyDeliveryRate;
use App\Services\Company\CompanyDeliveryRateService;
use Illuminate\Routing\Controller;

class CompanyDeliveryRateController extends Controller
{
    protected $service;

    public function __construct(CompanyDeliveryRateService $service)
    {
        $this->service = $service;
    }

    public function store(CompanyDeliveryRateRequest $request)
    {
        try {
            $this->service->store($request->validated());
            toast("Taxa adicionada com sucesso", 'success');
        } catch (\Exception $e) {
            toast($e->getMessage(), 'error');
        }
        return redirect()
            ->back();
    }

    public function delete(CompanyDeliveryRate  $companyDeliveryRate)
    {
        try {
            $this->service->delete($companyDeliveryRate);
        } catch (\Exception $e) {
            toast($e->getMessage(), 'error');
        }
        return redirect()
            ->back();
    }

}
