<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 15/06/2020
 * Time: 10:36
 */

namespace Delivery\Repositories\Order;


use App\Constants\Delivery\DeliveryOrderStatusConst;
use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use Delivery\Models\Order\DeliveryOrder;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class DeliveryOrderRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(DeliveryOrder::class);
    }

    public function findFully($id)
    {
        return $this->getModel()
            ::with([
                'deliveryRating',
                'companyAddress' => function (BelongsTo $query) {
                    $query->where("isDefault", true);
                },
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
                'driver' => function (BelongsTo $query) {
                    $query
                        ->join('user', 'driver.userId', '=', 'idUser')
                        ->select(
                            "idDriver",
                            'user.name',
                            'user.nickname',
                            'user.email',
                            'user.phone',
                            'driver.profileImage',
                            'user.idUser'
                        );
                },
                'deliveryOrderStatus',
                'deliveryPaymentForm' => function (BelongsTo $query) {
                    $query
                        ->select(
                            'id',
                            'name',
                            'paymentFormTypeId'
                        );
                },
                'deliveryOrderItems' => function (HasMany $query) {
                    $query
                        ->select(
                            'id',
                            'quantity',
                            'deliveryProductId',
                            'value',
                            'deliveryOrderId',
                            'obs'
                        )
                        ->with([
                            'deliveryProduct' => function (BelongsTo $query) {
                                $query->withTrashed();
                            },
                            'deliveryOrderComplements' => function (HasMany $query) {
                                $query
                                    ->with('deliveryComplement');
                            }
                        ]);
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
                },
                'userDiscountCouponDelivery' => function (BelongsTo $query) {
                    $query->with('discountCouponDelivery');
                }
            ])
            ->where('id', $id)
            ->firstOrFail();
    }

    /**
     * $id deve ser o idUser quando for buscar pedidos de um cliente
     * $id deve ser o idDriver e $isCustomer deve ser false, quando for buscar por entregador
     * @param int $id
     * @param bool $isCustomer
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function findActives(int $id, bool $isCustomer = true)
    {
        return $this->getModel()
            ::whereNotIn('deliveryOrderStatusId', [
                DeliveryOrderStatusConst::FINISHED,
                DeliveryOrderStatusConst::CANCELED,
                DeliveryOrderStatusConst::REFUSED,
            ])
            ->when($isCustomer,
                function (Builder $query) use ($id) {
                    $query
                        ->where('userId', $id);
                },
                function (Builder $query) use ($id) {
                    $query
                        ->where('driverId', $id);
                }
            )
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
                'companyAddress' => function (BelongsTo $query) {
                    $query->where("isDefault", true);
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
            ->get();
    }
}
