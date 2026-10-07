<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/05/2020
 * Time: 15:32
 */

namespace App\Repositories\Product;


use Common\Contracts\Repository\AbstractRepository;
use App\Models\Product\DeliveryCategory;
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
            ->get();
    }
    public function findCompanyCategoryWithProducts(int $companyId, ?array $request = [])
    {
        return $this->getModel()
            ::where('companyId', $companyId)
            ->with(["products"=>function($query)  use ($request) {
                $query
                    ->join('deliveryCategory', 'deliveryCategory.id','=','deliveryProduct.deliveryCategoryId')
                    ->when(isset($request['name']), function (Builder $query) use ($request) {
                        $query
                            ->where('deliveryProduct.name', 'LIKE', "%{$request['name']}%");
                    })
                    ->with([
                        'deliveryGroupComplements' => function (HasMany $query) {
                            $query
                                ->with('deliveryComplements');
                        }
                    ])
                    ->select([
                        "deliveryProduct.*"
                    ])
                    ->orderBy(DB::raw('ifnull(deliveryProduct.position, 9999)'))
                    ->orderBy('created_at');

            }])
            ->orderBy(DB::raw('ifnull(position, 9999)'))
            ->orderBy('created_at')
            ->get();
    }
}
