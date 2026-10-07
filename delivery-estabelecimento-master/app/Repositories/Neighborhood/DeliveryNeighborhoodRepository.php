<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 01/06/2020
 * Time: 17:18
 */

namespace App\Repositories\Neighborhood;


use Common\Contracts\Repository\AbstractRepository;
use App\Models\Company\Company;
use App\Models\Neighborhood\DeliveryNeighborhood;
use Illuminate\Database\Eloquent\Builder;

class DeliveryNeighborhoodRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(DeliveryNeighborhood::class);
    }

    public function findByCity(int $cityId)
    {
        return $this->getModel()
            ::where('cityId', $cityId)
            ->get();
    }

    public function findAvailableForCompany(Company $company)
    {
        return $this->getModel()
            ::where('cityId', $company->cityId)
            ->whereDoesntHave('companyDeliveryNeighborhood', function (Builder $query) use ($company) {
                $query
                    ->where('companyId', $company->id);
            })
            ->get();
    }
}
