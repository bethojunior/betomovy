<?php


namespace App\Repositories\Report;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Delivery\DeliveryOrder;
use App\Models\Role\Role;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\DB;

class DeliveryReportRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(DeliveryOrder::class);
    }

    public function allOrders(array $request = [], bool $isSupport = false, int $cityId = null)
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
                'company.name as companyName',
                'deliveryOrder.userId',
                'user.name as userName',
                'deliveryOrder.driverId',
                'uDriver.name as driverName',
                'deliveryOrderStatus.label as deliveryOrderStatus',
                'deliveryOrder.deliveryPaymentFormId',
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
            ->when(isset($request['companyId']), function (Builder $query) use ($request) {
                $query->where('deliveryOrder.companyId', $request['companyId']);
            })
            ->when(isset($request['deliveryPaymentFormId']), function (Builder $query) use ($request) {
                $query->where('deliveryOrder.deliveryPaymentFormId', $request['deliveryPaymentFormId']);
            })
            ->when(!$isSupport && isset($cityId), function (Builder $query) use ($cityId) {
                $query->where('deliveryOrder.cityId', $cityId);
            })
            ->when(isset($request['driverId']),  function (Builder $query) use ($request) {
                $query->where('deliveryOrder.driverId', $request['driverId']);
            })
            ->get();
    }

    public function deliveryFeeManagement(array $request = [], Role $roleAuthUser = null)
    {
        return $this->getModel()
            ::join('driver', 'deliveryOrder.driverId', 'driver.idDriver')
            ->join('user', 'driver.userId', '=', 'idUser')
            ->where('user.statusId', StatusConst::ACTIVE)
            ->join('driverRegisterStatus', 'driverRegisterStatusId', '=', 'idDriverRegisterStatus')
            ->join('levelAccess', 'driver.userId', '=', 'levelAccess.userId')
            ->join('userType', 'levelAccess.userTypeId', '=', 'userType.idUserType')
            ->join('balance', 'driver.balanceId', '=', 'balance.idBalance')
            ->leftJoin('city', 'driver.cityId', '=', 'city.id')
            ->join('deliveryRate', 'deliveryOrder.deliveryRateId', '=', 'deliveryRate.id')
            ->select(
                'user.name',
                'user.document',
                'user.phone',
                'user.email',
                'userType.name AS userType',
                'driverRegisterStatus.name AS driverRegisterStatus',
                'city.nome AS cityName',
                'deliveryRate.tax AS deliveryRateTax',
                'deliveryRate.deliveryServiceFee AS deliveryServiceFee',
                'balance.balance'
            )
            ->when(isset($roleAuthUser->support) && !$roleAuthUser->support, function (Builder $query) use ($roleAuthUser) {
                $query->whereIn('driver.cityId', function (\Illuminate\Database\Query\Builder $query) use ($roleAuthUser) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleCity.roleId', $roleAuthUser->id);
                });
            })
            ->orderByDesc('user.created_at')
            ->when(isset($request['driverId']),  function (Builder $query) use ($request) {
                $query->where('deliveryOrder.driverId', $request['driverId']);
            })
            ->when(isset($request['dateStart']), function (Builder $query) use ($request) {
                $query->where('deliveryOrder.created_at', '>=', Carbon::parse($request['dateStart'])->startOfDay());
            })
            ->when(isset($request['dateEnd']), function (Builder $query) use ($request) {
                $query->where('deliveryOrder.created_at', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
            })
            ->when(isset($request['cityId']), function (Builder $query) use ($request) {
                $query
                    ->where('driver.cityId', '=', $request['cityId']);
            })
            ->get();
    }
}
