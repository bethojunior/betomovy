<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/08/2020
 * Time: 14:16
 */

namespace App\Services\Company;


use Auth;
use Common\Models\Config\CompanyDeliveryOrderConfig;
use Common\Repositories\Config\CompanyDeliveryOrderConfigRepository;

class CompanyDeliveryOrderConfigService
{
    /**
     * @var CompanyDeliveryOrderConfigRepository
     */
    private $repository;

    public function __construct(CompanyDeliveryOrderConfigRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * @return CompanyDeliveryOrderConfig|null
     */
    public function findByCompany(): ?CompanyDeliveryOrderConfig
    {
        $companyId = Auth::user()->companyWorker->companyId;

        /** @var CompanyDeliveryOrderConfig $companyDeliveryOrderConfig */
        $companyDeliveryOrderConfig = $this->repository
            ->findByCompany($companyId);

        return $companyDeliveryOrderConfig;
    }

    /**
     * @param array $request
     * @return CompanyDeliveryOrderConfig
     */
    public function updateMinPrice(array $request)
    {
        $companyId = Auth::user()->companyWorker->companyId;

        /** @var CompanyDeliveryOrderConfig $companyDeliveryOrderConfig */
        $companyDeliveryOrderConfig = $this->repository
            ->findByCompany($companyId);

        if (!$companyDeliveryOrderConfig)
            $companyDeliveryOrderConfig = new CompanyDeliveryOrderConfig($request);

        $companyDeliveryOrderConfig->minimumOrderValue = $request['minimumOrderValue'];

        $this->repository->save($companyDeliveryOrderConfig);

        return $companyDeliveryOrderConfig;
    }

    /**
     * @param array $request
     * @return CompanyDeliveryOrderConfig
     */
    public function updateAverageDeliveryTime(array $request)
    {
        $companyId = Auth::user()->companyWorker->companyId;

        /** @var CompanyDeliveryOrderConfig $companyDeliveryOrderConfig */
        $companyDeliveryOrderConfig = $this->repository
            ->findByCompany($companyId);

        if (!$companyDeliveryOrderConfig)
            $companyDeliveryOrderConfig = new CompanyDeliveryOrderConfig($request);

        $companyDeliveryOrderConfig->averageDeliveryTime = $request['averageDeliveryTime'];

        $this->repository->save($companyDeliveryOrderConfig);

        return $companyDeliveryOrderConfig;
    }

    public function updateCalledMode(array $request)
    {
        $companyId = Auth::user()->companyWorker->companyId;

        /** @var CompanyDeliveryOrderConfig $companyDeliveryOrderConfig */
        $companyDeliveryOrderConfig = $this->repository
            ->findByCompany($companyId);

        if (!$companyDeliveryOrderConfig)
            $companyDeliveryOrderConfig = new CompanyDeliveryOrderConfig($request);

        $companyDeliveryOrderConfig->callForAll = $request['callForAll'];

        $this->repository->save($companyDeliveryOrderConfig);
        return $companyDeliveryOrderConfig;

    }
}
