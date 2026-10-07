<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Http\Requests\Company\CompanyPaymentFormRequest;
use App\Models\Company\CompanyPaymentForm;
use App\Repositories\Company\CompanyPaymentFormRepository;
use App\Repositories\Company\DeliveryPaymentFormRepository;
use App\Services\Company\CompanyPaymentFormService;
use Illuminate\Http\Request;

class CompanyPaymentFormController extends Controller
{
    /**
     * @var CompanyPaymentFormService
     */
    private $service;

    public function __construct(CompanyPaymentFormService $service)
    {
        $this->service = $service;
    }

    public function index(DeliveryPaymentFormRepository $deliveryPaymentFormRepository,
                          CompanyPaymentFormRepository $companyPaymentFormRepository)
    {
        $company = \Auth::user()->companyWorker->company;

        $deliveryPaymentForms = $deliveryPaymentFormRepository->findAvailableForCompany($company);

        $companyPaymentForms = $companyPaymentFormRepository->findAllByCompany($company->id);

        return view('paymentForms.index',
            compact('deliveryPaymentForms', 'companyPaymentForms'));
    }

    public function store(CompanyPaymentFormRequest $request)
    {
        try {
            $this->service
                ->store($request->validated());

            toast("Forma de pagamento inserida com sucesso", 'success');
        } catch (\Exception $e) {
            toast($e->getMessage(), 'error');
        }
        return redirect()
            ->back();
    }

    public function delete(CompanyPaymentForm $companyPaymentForm)
    {
        try {
            $this->service
                ->delete($companyPaymentForm);

            toast("Forma de pagamento excluída com sucesso", 'success');
        } catch (\Exception $e) {
            toast($e->getMessage(), 'error');
        }

        return redirect()
            ->back();
    }
}
