<?php


namespace Api\Services\Company;


use Api\Repositories\Company\CompanyDeliveryOrderConfigRepository;
use Api\Repositories\Company\CompanyDeliveryRateRepository;
use Api\Repositories\Delivery\DeliveryRateRepository;

class CompanyDeliveryRateService
{
    private $repository;
    private $companyDeliveryOrderConfigRepository;
    private $deliveryRateRepository;

    public function __construct(
        CompanyDeliveryRateRepository $repository,
        CompanyDeliveryOrderConfigRepository $companyDeliveryOrderConfigRepository,
        DeliveryRateRepository $deliveryRateRepository)
    {
        $this->repository = $repository;
        $this->companyDeliveryOrderConfigRepository = $companyDeliveryOrderConfigRepository;
        $this->deliveryRateRepository = $deliveryRateRepository;
    }

    public function findByCompany($companyId)
    {
        $companyDeliveryOrderConfig = $this->companyDeliveryOrderConfigRepository->findByCompany($companyId);

        if (isset($companyDeliveryOrderConfig))
            if ($companyDeliveryOrderConfig->callForAll)
                return $this->deliveryRateRepository->findAll();

        return $this->repository->findByCompany($companyId);
    }

}
