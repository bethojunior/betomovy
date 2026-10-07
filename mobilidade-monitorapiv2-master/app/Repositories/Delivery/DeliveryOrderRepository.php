<?php


namespace App\Repositories\Delivery;


use App\Constants\Delivery\OrderDeliveryStatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Delivery\DeliveryOrder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class DeliveryOrderRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel( DeliveryOrder::class);
    }

    public function actives(int $cityId)
    {
        return $this->getModel()
            ::where("cityId", $cityId)
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
            ->whereNotIn('deliveryOrderStatusId', [
                OrderDeliveryStatusConst::CANCELED,
                OrderDeliveryStatusConst::FINISHED,
                OrderDeliveryStatusConst::REFUSED
            ])
            ->orderByDesc('created_at')
            ->get();
    }

}
