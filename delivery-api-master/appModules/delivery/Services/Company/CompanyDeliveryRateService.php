<?php


namespace Delivery\Services\Company;


use Delivery\Constants\DeliveryOrder\TypeDeliveryAreaConst;
use Delivery\Repositories\Company\CompanyDeliveryAreaRepository;
use Delivery\Repositories\Company\CompanyDeliveryNeighborhoodRepository;
use Delivery\Repositories\Company\CompanyDeliveryOrderConfigRepository;
use Delivery\Repositories\Company\CompanyDeliveryRateRepository;
use Delivery\Repositories\Config\ConfigRepository;
use Delivery\Repositories\Delivery\DeliveryRateRepository;

class CompanyDeliveryRateService
{
    private $repository;
    private $companyDeliveryOrderConfigRepository;
    private $deliveryRateRepository;
    private $companyDeliveryAreaRepository;
    private $companyDeliveryNeighborhoodRepository;
    private $configRepository;

    public function __construct(
        CompanyDeliveryRateRepository         $repository,
        CompanyDeliveryOrderConfigRepository  $companyDeliveryOrderConfigRepository,
        CompanyDeliveryAreaRepository         $companyDeliveryAreaRepository,
        DeliveryRateRepository                $deliveryRateRepository,
        ConfigRepository                      $configRepository,
        CompanyDeliveryNeighborhoodRepository $companyDeliveryNeighborhoodRepository
    )
    {
        $this->repository = $repository;
        $this->companyDeliveryOrderConfigRepository = $companyDeliveryOrderConfigRepository;
        $this->companyDeliveryAreaRepository = $companyDeliveryAreaRepository;
        $this->deliveryRateRepository = $deliveryRateRepository;
        $this->configRepository = $configRepository;
        $this->companyDeliveryNeighborhoodRepository = $companyDeliveryNeighborhoodRepository;
    }

    public function calculate($companyId, array $request)
    {
        $config = $this->configRepository->findByKey('type_of_delivery_area');

        switch ($config->value) {
            case TypeDeliveryAreaConst::AREA:
                if (!$this->companyDeliveryAreaRepository->getDeliverAreaByCompany($request['lat'], $request['lng'], $companyId)) {
                    return null;
                }

                $companyDeliveryOrderConfig = $this->companyDeliveryOrderConfigRepository->findByCompany($companyId);

                if (isset($companyDeliveryOrderConfig)) {
                    if ($companyDeliveryOrderConfig->callForAll) {
                        return $this->deliveryRateRepository->calculate($request['lat'], $request['lng'], $companyId);
                    }
                }
                return $this->repository->calculate($request['lat'], $request['lng'], $companyId);

            case TypeDeliveryAreaConst::NEIGHBORHOOD:
                $result = $this->companyDeliveryNeighborhoodRepository->findDeliveryNeighborhoodAndCompanyByArea($request['lat'], $request['lng'], $companyId);

                if (!$result) {
                    return null;
                }

                $companyDeliveryOrderConfig = $this->companyDeliveryOrderConfigRepository->findByCompany($companyId);

                if ($companyDeliveryOrderConfig->callForAll) {
                    return $this->deliveryRateRepository->calculate($request['lat'], $request['lng'], $companyId);
                }

                return $result;
        }
    }
}
