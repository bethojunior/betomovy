<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 01/06/2020
 * Time: 08:13
 */

namespace Delivery\Repositories\Product;


use App\Contracts\Repository\AbstractRepository;
use Delivery\Models\Product\DeliveryCategory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class DeliveryCategoryRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(DeliveryCategory::class);
    }

    public function findByCompany(int $companyId)
    {
        return $this->getModel()
            ::where('companyId', $companyId)
            ->with(
                [
                    'deliveryProducts' => function (HasMany $query) {
                        $query->orderBy(DB::raw('ifnull(deliveryProduct.position, 9999)'))
                            ->orderBy('created_at')
                            ->orderBy('active', 'desc');
                    }
                ])
            ->whereHas('deliveryProducts')
            ->orderBy(DB::raw('ifnull(position, 9999)'))
            ->orderBy('created_at')
            ->get();
    }
}
