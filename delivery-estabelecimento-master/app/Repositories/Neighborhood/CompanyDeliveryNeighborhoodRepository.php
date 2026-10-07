<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 02/06/2020
 * Time: 11:02
 */

namespace App\Repositories\Neighborhood;


use Common\Contracts\Repository\AbstractRepository;
use App\Models\Neighborhood\CompanyDeliveryNeighborhood;
use Illuminate\Database\Eloquent\Builder;

class CompanyDeliveryNeighborhoodRepository extends AbstractRepository
{
    /**
     * CompanyDeliveryNeighborhoodRepository constructor.
     */
    public function __construct()
    {
        $this->setModel(CompanyDeliveryNeighborhood::class);
    }

    public function findAllByCompany(int $companyId, ?array $request)
    {
        return $this->getModel()
            ::where('companyId', $companyId)
            ->whereNull('deliveryNeighborhood.deleted_at')
            ->join(
                'deliveryNeighborhood', 'deliveryNeighborhoodId', '=', 'deliveryNeighborhood.id')
            ->select(
                'companyDeliveryNeighborhood.id',
                'deliveryNeighborhood.name',
                'companyDeliveryNeighborhood.price',
                'deliveryNeighborhood.deliveryPrice',
                'companyDeliveryNeighborhood.active',
                'companyDeliveryNeighborhood.companyId'
            )
            ->when(isset($request['name']), function (Builder $query) use ($request) {
                $query
                    ->where('deliveryNeighborhood.name', 'LIKE', "%{$request['name']}%");
            })
            ->paginate();
    }
}
