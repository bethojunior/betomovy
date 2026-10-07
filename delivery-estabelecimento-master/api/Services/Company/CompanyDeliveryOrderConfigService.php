<?php


namespace Api\Services\Company;


use Api\Repositories\Company\CompanyDeliveryOrderConfigRepository;
use Common\Models\Config\CompanyDeliveryOrderConfig;

class CompanyDeliveryOrderConfigService
{
    /**
     * @var CompanyDeliveryOrderConfigRepository
     */
    private $companyDeliveryOrderConfigRepository;

    public function __construct(CompanyDeliveryOrderConfigRepository $repository)
    {
        $this->companyDeliveryOrderConfigRepository = $repository;
    }

    /**
     * @param $companyId
     * @return \Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Eloquent\Model|object|null
     */
    public function findByCompany($companyId)
    {
        $config = $this->companyDeliveryOrderConfigRepository->findByCompany($companyId);

        if (!$config) {
            $config = new CompanyDeliveryOrderConfig();
            $config->companyId = $companyId;
            $config->minimumOrderValue = 0;
            $config->save();
        }

        return $config;
    }

    /**
     * @param $companyId
     * @param array $request
     * @return \Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Eloquent\Model|object|null
     * @throws \Exception
     */
    public function changeOpeningStatus($companyId, array $request)
    {
        if (!isset($companyId))
            throw new \Exception("companyId não informado");

        if (!isset($request['isOpen']))
            throw new \Exception("isOpen não informado");

        $config = $this->companyDeliveryOrderConfigRepository->findByCompany($companyId);

        $config->isOpen = $request['isOpen'];

        $config->save();

        return $config;
    }
}
