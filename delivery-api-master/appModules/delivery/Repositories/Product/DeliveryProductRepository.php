<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 01/06/2020
 * Time: 08:12
 */

namespace Delivery\Repositories\Product;


use App\Contracts\Repository\AbstractRepository;
use Delivery\Models\Product\DeliveryProduct;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DeliveryProductRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(DeliveryProduct::class);
    }

    public function findOne(int $id)
    {
        return $this->getModel()
            ::where('id', $id)
            ->with([
                'deliveryGroupComplements' => function (HasMany $query) {
                    $query
                        ->with('deliveryComplements');
                }
            ])
            ->first();
    }

    public function preparationTime(array $deliveryProductIds)
    {
        return $this->getModel()
            ::select([
                \DB::raw("SUM(preparationTime) as preparationTime")
            ])
            ->whereIn("id",$deliveryProductIds)
            ->first();
    }
}
