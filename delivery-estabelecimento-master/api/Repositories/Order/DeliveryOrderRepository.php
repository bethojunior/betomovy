<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 16/06/2020
 * Time: 10:07
 */

namespace Api\Repositories\Order;

use Carbon\Carbon;
use Common\Constants\DeliveryOrderStatusConstant;
use Common\Contracts\Repository\AbstractRepository;
use Common\Models\Order\DeliveryOrder;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\DB;

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

    public function findActivesByCompany(int $companyId)
    {
        return $this->getModel()
            ::where('companyId', $companyId)
            ->whereNotIn('deliveryOrderStatusId', [
                DeliveryOrderStatusConstant::CANCELED,
                DeliveryOrderStatusConstant::FINISHED,
                DeliveryOrderStatusConstant::REFUSED,
            ])
            ->with([
                'user',
                'deliveryOrderStatus',
                'deliveryPaymentForm',
                'orderDeliveryType',
                'deliveryOrderPlace' => function (HasOne $query) {
                    $query->join("places", "places.idPlace", "=", "deliveryOrderPlace.placeId")
                        ->select(["deliveryOrderPlace.deliveryOrderId", "address", "number", "neighborhood"]);
                },
                'driver' => function (BelongsTo $query) {
                    $query->join("user", "user.idUser", "=", "driver.userId")
                        ->select(["idDriver", "name", "nickname", "phone", "driver.profileImage"]);
                },
                'deliveryOrderItems' => function ($query) {
                    $query->with('deliveryProduct');
                },
                'userDiscountCouponDelivery' => function (BelongsTo $query) {
                    $query->with('discountCouponDelivery');
                }
            ])
            ->orderByDesc('created_at')
            ->get();
    }

    public function findFully($id)
    {
        return $this->getModel()
            ::with([
                'deliveryOrderStatus',
                'company',
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
                'user'
            ])
            ->where('id', $id)
            ->firstOrFail();
    }

    public function findAll(int $companyId, array $request)
    {
        return $this->getModel()
            ::where('companyId', $companyId)
            ->with([
                'user',
                'deliveryOrderStatus',
                'deliveryPaymentForm',
                'deliveryOrderPlace' => function (HasOne $query) {
                    $query->join("places", "places.idPlace", "=", "deliveryOrderPlace.placeId")
                        ->select(["deliveryOrderPlace.deliveryOrderId", "address", "neighborhood"]);
                },
                'driver' => function (BelongsTo $query) {
                    $query->join("user", "user.idUser", "=", "driver.userId")
                        ->select(["idDriver", "name", "nickname", "phone", "driver.profileImage"]);
                },
                'deliveryOrderItems' => function ($query) {
                    $query->with('deliveryProduct');
                },
                'userDiscountCouponDelivery' => function (BelongsTo $query) {
                    $query->with('discountCouponDelivery');
                }
            ])
            ->when(isset($request['dateStart']) && isset($request['dateEnd']), function (Builder $query) use ($request) {
                $query->whereBetween('created_at', [$request['dateStart'], $request['dateEnd']]);
            })
            ->orderByDesc('created_at')
            ->paginate();
    }

    public function findAllToReport(int $companyId, array $request)
    {
        return $this->getModel()::query()
            ->join('company', 'deliveryOrder.companyId', 'company.id')
            ->join('user', 'deliveryOrder.userId', 'user.idUser')
            ->join('deliveryOrderStatus', 'deliveryOrder.deliveryOrderStatusId', 'deliveryOrderStatus.id')
            ->join('deliveryPaymentForm', 'deliveryOrder.deliveryPaymentFormId', 'deliveryPaymentForm.id')
            ->leftJoin('driver', 'deliveryOrder.driverId', 'driver.idDriver')
            ->leftJoin('user as uDriver', 'driver.userId', 'uDriver.idUser')
            ->leftJoin('userDiscountCouponDelivery', 'deliveryOrder.id', 'userDiscountCouponDelivery.deliveryOrderId')
            ->leftJoin('discountCouponDelivery', 'userDiscountCouponDelivery.discountCouponDeliveryId', 'discountCouponDelivery.id')
            ->leftJoin('establishmentCollectionManagement', 'deliveryOrder.establishmentCollectionManagementId', 'establishmentCollectionManagement.id')
            ->select(
                'deliveryOrder.id',
                'deliveryOrder.companyId',
                'company.fantasyName as companyName',
                'deliveryOrder.userId',
                'user.name as userName',
                'deliveryOrder.driverId',
                'uDriver.name as driverName',
                'deliveryOrderStatus.label as deliveryOrderStatus',
                'deliveryPaymentForm.name as deliveryPaymentForm',
                DB::raw('(deliveryOrder.value - deliveryOrder.deliveryFee + coalesce(discountCouponDelivery.value, 0)) as orderValue'),
                'deliveryOrder.value as totalOrderValue',
                'discountCouponDelivery.code as discountCoupon',
                'discountCouponDelivery.value as discountCouponValue',
                'deliveryOrder.deliveryFee',
                'establishmentCollectionManagement.orderPercentage as chargeOrderPercentage',
                'establishmentCollectionManagement.orderValue as chargeOrderValue',
                'deliveryOrder.created_at'
            )
            ->when(isset($request['dateStart']), function (Builder $query) use ($request) {
                $query->where('deliveryOrder.created_at', '>=', Carbon::parse($request['dateStart'])->startOfDay());
            })
            ->when(isset($request['dateEnd']), function (Builder $query) use ($request) {
                $query->where('deliveryOrder.created_at', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
            })
            ->when(isset($request['status']), function (Builder $query) use ($request) {
                $query->where('deliveryOrder.deliveryOrderStatusId', $request['status']);
            })
            ->when(isset($request['paymentForm']), function (Builder $query) use ($request) {
                $query->where('deliveryOrder.deliveryPaymentFormId', $request['paymentForm']);
            })
            ->when(isset($request['companyId']), function (Builder $query) use ($companyId) {
                $query->where('deliveryOrder.companyId', $companyId);
            })
            ->where('deliveryOrder.companyId', $companyId)
            ->orderByDesc("deliveryOrder.created_at")
            ->get();
    }
}
