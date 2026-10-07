<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 03/06/2020
 * Time: 09:19
 */

namespace App\Repositories\Product;


use Common\Contracts\Repository\AbstractRepository;
use App\Models\Product\DeliveryProduct;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DeliveryProductRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(DeliveryProduct::class);
    }

    public function findByCompany(int $companyId, ?array $request = [])
    {
        return $this->getModel()
            ::where('deliveryProduct.companyId', $companyId)
            ->join('deliveryCategory', 'deliveryCategory.id','=','deliveryProduct.deliveryCategoryId')
            ->when(isset($request['name']), function (Builder $query) use ($request) {
                $query
                    ->where('deliveryProduct.name', 'LIKE', "%{$request['name']}%");
            })
            ->with([
                'deliveryGroupComplements' => function (HasMany $query) {
                    $query
                        ->with('deliveryComplements');
                },
                'deliveryCategory' => function (BelongsTo $query) {
                    $query->withTrashed();
                }
            ])
            ->whereHas("deliveryCategory", function ($query){
                $query->where('deleted_at', null);
            })
            ->select([
                "deliveryProduct.*"
            ])
            ->orderBy('deliveryCategory.name')
            ->paginate(10);
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
}
