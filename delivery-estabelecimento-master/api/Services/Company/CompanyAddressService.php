<?php


namespace Api\Services\Company;


use Api\Repositories\Company\CompanyAddressRepository;
use App\Models\Company\CompanyAddress;

class CompanyAddressService
{
    private $repository;

    public function __construct(CompanyAddressRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findActive($companyId)
    {
        return $this->repository->findActive($companyId);
    }

    /**
     * @param array $request
     * @return CompanyAddress
     */
    public function store(array $request)
    {
        $this->repository->disableMarkIsDefault($request['companyId']);

        $companyAddress = new CompanyAddress($request);
        $companyAddress->isDefault = true;
        $companyAddress->save();

        return $companyAddress;
    }

}
