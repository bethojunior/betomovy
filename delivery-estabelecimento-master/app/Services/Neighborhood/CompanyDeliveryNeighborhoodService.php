<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 02/06/2020
 * Time: 11:28
 */

namespace App\Services\Neighborhood;


use App\Models\Neighborhood\CompanyDeliveryNeighborhood;

class CompanyDeliveryNeighborhoodService
{
    /**
     * @param array $request
     * @return CompanyDeliveryNeighborhood
     */
    public function store(array $request): CompanyDeliveryNeighborhood
    {
        $companyDeliveryNeighborhood = new CompanyDeliveryNeighborhood($request);
        $companyDeliveryNeighborhood->companyId = \Auth::user()->companyWorker->company->id;
        $companyDeliveryNeighborhood->save();

        return $companyDeliveryNeighborhood;
    }

    /**
     * @param CompanyDeliveryNeighborhood $companyDeliveryNeighborhood
     * @return bool|null
     * @throws \Exception
     */
    public function delete(CompanyDeliveryNeighborhood $companyDeliveryNeighborhood): ?bool
    {
        return $companyDeliveryNeighborhood
            ->delete();
    }

    /**
     * @param CompanyDeliveryNeighborhood $companyDeliveryNeighborhood
     * @param bool $active
     * @return CompanyDeliveryNeighborhood
     */
    public function updateActive(CompanyDeliveryNeighborhood $companyDeliveryNeighborhood,
                                 bool $active): CompanyDeliveryNeighborhood
    {
        $companyDeliveryNeighborhood->active = $active;
        $companyDeliveryNeighborhood->save();

        return $companyDeliveryNeighborhood;
    }
}
