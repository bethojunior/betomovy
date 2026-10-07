<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/06/2020
 * Time: 18:42
 */

namespace Delivery\Services\Neighborhood;


use Delivery\Models\Company\Company;
use Delivery\Models\Neighborhood\DeliveryNeighborhood;
use Delivery\Repositories\Company\CompanyDeliveryNeighborhoodRepository;
use Delivery\Repositories\Neighborhood\DeliveryNeighborhoodRepository;

class DeliveryNeighborhoodService
{
    /**
     * @var DeliveryNeighborhoodRepository
     */
    private $repository;
    /**
     * @var CompanyDeliveryNeighborhoodRepository
     */
    private $companyDeliveryNeighborhoodRepository;

    public function __construct(DeliveryNeighborhoodRepository $repository,
                                CompanyDeliveryNeighborhoodRepository $companyDeliveryNeighborhoodRepository)
    {
        $this->repository = $repository;
        $this->companyDeliveryNeighborhoodRepository = $companyDeliveryNeighborhoodRepository;
    }

    public function findByCoordinate(array $request)
    {
        list('lat' => $lat, 'lng' => $lng) = $request;

        return $this->repository
            ->findByCoordinate($lat, $lng);
    }

    /**
     * @param DeliveryNeighborhood $deliveryNeighborhood
     * @param Company $company
     * @return array|null
     */
    public function consultDeliveryPrice(DeliveryNeighborhood $deliveryNeighborhood, Company $company): ?array
    {
        $companyDeliveryNeighborhood = $this->companyDeliveryNeighborhoodRepository
            ->findActiveByDeliveryNeighborhoodAndCompany($deliveryNeighborhood->id, $company->id);

        if ($companyDeliveryNeighborhood)
            return ['deliveryPrice' => $companyDeliveryNeighborhood->price];

        return ['deliveryPrice' => $deliveryNeighborhood->deliveryPrice];
    }
}
