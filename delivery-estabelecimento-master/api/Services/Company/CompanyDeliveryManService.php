<?php


namespace Api\Services\Company;

use Api\Repositories\Company\CompanyDeliveryManRepository;

class CompanyDeliveryManService
{
    private $repository;

    public function __construct(CompanyDeliveryManRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findDeliveryManByCompanyId($companyId)
    {
        return $this->repository->findDeliveryManByCompanyId($companyId);
    }


    public function findDeliveryManActiveByCompanyId($companyId)
    {
        return $this->repository->findDeliveryManActiveByCompanyId($companyId);
    }

}
