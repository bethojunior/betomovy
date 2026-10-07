<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 31/05/2020
 * Time: 16:43
 */

namespace App\Services\Company;


use App\Models\Company\CompanyAddress;
use App\Repositories\Company\CompanyAddressRepository;

class CompanyAddressService
{
    /**
     * @var CompanyAddressRepository
     */
    private $repository;

    public function __construct(CompanyAddressRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * @param array $request
     * @return \Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model[]
     */
    public function findAll(?array $request = [])
    {
        return $this->repository->findAll($request);
    }

    /**
     * @param array $request
     * @return CompanyAddress
     */
    public function store(array $request)
    {
        if (isset($request['isDefault']))
            $this->repository->disableMarkIsDefault($request['companyId']);

        $companyAddress = new CompanyAddress($request);
        $companyAddress->save();

        return $companyAddress;
    }

    /**
     * @param CompanyAddress $companyAddress
     * @return bool|null
     * @throws \Exception
     */
    public function delete(CompanyAddress $companyAddress)
    {
        return $companyAddress->delete();
    }

    /**
     * @param CompanyAddress $companyAddress
     * @return CompanyAddress
     */
    public function markDefault(CompanyAddress $companyAddress)
    {
        $this->repository->disableMarkIsDefault($companyAddress->companyId);

        $companyAddress
            ->isDefault = true;
        $companyAddress->save();

        return $companyAddress;
    }
}
