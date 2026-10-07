<?php


namespace App\Services\Company;


use App\Constants\StatusConst;
use App\Models\Company\CompanyDeliveryRate;
use App\Repositories\Company\CompanyDeliveryRateRepository;

class CompanyDeliveryRateService
{

    protected $repository;

    public function __construct(CompanyDeliveryRateRepository $repository)
    {
        $this->repository = $repository;
    }

    public function store(array $request)
    {
        if ($this->repository->feeAlreadyExists($request['companyId'], $request['range']))
            throw new \Exception("Taxa já cadastrada");

        $companyDeliveryRate = new CompanyDeliveryRate($request);
        $companyDeliveryRate->save();

        return $companyDeliveryRate;
    }

    public function delete(CompanyDeliveryRate $companyDeliveryRate)
    {
        $companyDeliveryRate->statusId = StatusConst::REMOVED;
        $companyDeliveryRate->save();

        return $companyDeliveryRate;
    }
}
