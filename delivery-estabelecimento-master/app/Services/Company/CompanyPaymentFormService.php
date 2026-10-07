<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/06/2020
 * Time: 18:00
 */

namespace App\Services\Company;


use App\Models\Company\CompanyPaymentForm;
use App\Repositories\Company\CompanyPaymentFormRepository;

class CompanyPaymentFormService
{
    /**
     * @var CompanyPaymentFormRepository
     */
    private $repository;

    public function __construct(CompanyPaymentFormRepository $repository)
    {
        $this->repository = $repository;
    }

    public function all()
    {
        return $this->repository
            ->all();
    }

    /**
     * @param array $request
     * @return CompanyPaymentForm
     */
    public function store(array $request): CompanyPaymentForm
    {
        $companyPaymentForm = new CompanyPaymentForm($request);
        $companyPaymentForm->companyId = \Auth::user()->companyWorker->company->id;
        $companyPaymentForm->save();

        return $companyPaymentForm;
    }

    /**
     * @param CompanyPaymentForm $companyPaymentForm
     * @return bool
     * @throws \Exception
     */
    public function delete(CompanyPaymentForm $companyPaymentForm): bool
    {
        return $companyPaymentForm->delete();
    }
}
