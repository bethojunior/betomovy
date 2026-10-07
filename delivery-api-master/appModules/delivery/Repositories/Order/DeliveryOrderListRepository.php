<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/07/2020
 * Time: 18:10
 */

namespace Delivery\Repositories\Order;


use App\Contracts\Repository\AbstractRepository;
use Delivery\Models\Order\DeliveryOrder;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class DeliveryOrderListRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(DeliveryOrder::class);
    }

    /**
     * $id deve ser o idUser quando for buscar pedidos de um cliente
     * $id deve ser o idDriver e $isCustomer deve ser false, quando for buscar por entregador
     * @param int $id
     * @param array $request
     * @param bool $isCustomer
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function findByUser(int $id, array $request = [], bool $isCustomer = true)
    {
        return $this->getModel()
            ::when($isCustomer,
                function (Builder $query) use ($id) {
                    $query
                        ->where('userId', $id);
                },
                function (Builder $query) use ($id) {
                    $query
                        ->where('driverId', $id);
                }
            )
            ->when(isset($request['deliveryOrderStatusId']), function (Builder $query) use ($request) {
                $query
                    ->where('deliveryOrderStatusId', $request['deliveryOrderStatusId']);
            })
            ->with([
                'company' => function (BelongsTo $query) {
                    $query
                        ->select(
                            'id',
                            'fantasyName',
                            'address',
                            'document',
                            'cityId',
                            'email',
                            'phone',
                            'latitude',
                            'longitude'
                        )
                        ->with([
                            'companyDeliveryConfig' => function (HasOne $query) {
                                $query
                                    ->select(
                                        'id',
                                        'companyId',
                                        'releaseMenu',
                                        'releaseDelivery',
                                        'picture'
                                    );
                            }
                        ]);
                },
                'deliveryOrderStatus',
                'deliveryPaymentForm',
                'deliveryOrderItems' => function ($query) {
                    $query->with('deliveryProduct');
                },
                'deliveryOrderPlace' => function (HasOne $query) {
                    $query
                        ->select(
                            'id',
                            'deliveryOrderId',
                            'placeId'
                        )
                        ->with([
                            'place' => function (BelongsTo $query) {
                                $query
                                    ->select(
                                        'idPlace',
                                        'alias',
                                        'address',
                                        'number',
                                        'zipcode',
                                        'neighborhood',
                                        'latitude',
                                        'longitude',
                                        'complement',
                                        'referencePoint',
                                        'deliveryNeighborhoodId'
                                    );
                            }
                        ]);
                },
                'customer' => function (BelongsTo $query) {
                    $query
                        ->select(
                            'idUser',
                            'name',
                            'email',
                            'phone',
                            'nickname'
                        );
                }
            ])
            ->orderByDesc('created_at')
            ->paginate();
    }
}
