<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 01/06/2020
 * Time: 11:48
 */

namespace App\Repositories\Delivery;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Delivery\DeliveryNeighborhood;
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

    public function findAll(?array $request)
    {
        return $this->getModel()
            ::orderBy('name')
            ->when(isset($request['cityId']), function (Builder $query) use ($request) {
                $query
                    ->where('cityId', $request['cityId']);
            })
            ->select([
                'id',
                'name',
                'deliveryPrice',
                'cityId'
            ])
            ->selectRaw('ST_AsText(area) AS area')
            ->with('city')
            ->get();
    }
}
