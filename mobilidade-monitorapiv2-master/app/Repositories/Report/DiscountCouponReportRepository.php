<?php


namespace App\Repositories\Report;


use App\Contracts\Repository\AbstractRepository;
use App\Models\DiscountCoupon\DiscountCoupon;
use App\Models\Role\Role;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class DiscountCouponReportRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(DiscountCoupon::class);
    }

    public function findAllDiscountedTrip(array $request, Role $authRole)
    {
        return $this->getModel()::query()
            ->join('userDiscountCoupon', 'discountCoupon.id', '=', 'userDiscountCoupon.discountCouponId')
            ->join('tripDiscountCoupon', 'userDiscountCoupon.id', '=', 'tripDiscountCoupon.userDiscountCouponId')
            ->join('trip', 'tripDiscountCoupon.tripReference', '=', 'trip.tripReference')
            ->join('tripType', 'trip.tripTypeId', '=', 'tripType.idTripType')
            ->join('tripPaymentForm', 'trip.tripPaymentFormId', '=', 'tripPaymentForm.idTripPaymentForm')
            ->join('tripCallType', 'trip.tripCallTypeId', '=', 'tripCallType.id')
            ->join('destination', 'trip.destinationId', '=', 'destination.idDestination')
            ->join('origin', 'trip.originId', '=', 'origin.idOrigin')
            ->join('user', 'trip.userId', '=', 'user.idUser')
            ->join('driver', 'trip.driverId', '=', 'driver.idDriver')
            ->join('user as ud', 'driver.userId', '=', 'ud.idUser')
            ->leftJoin('city', 'city.id', 'trip.cityId')
            ->where('trip.status', '=', 'finished')
            ->when(isset($request['codeCoupon']), function (Builder $query) use ($request) {
                $query->where('code', '=', $request['codeCoupon']);
            })
            ->when(isset($request['userId']), function (Builder $query) use ($request) {
                $query->where('user.idUser', '=', $request['userId']);
            })
            ->when(isset($request['dateStart']),
                function (Builder $query) use ($request) {
                    $query->where(
                        'trip.date', '>=',
                        Carbon::parse($request['dateStart'])->startOfDay()
                    );
                })
            ->when(isset($request['dateEnd']),
                function (Builder $query) use ($request) {
                    $query->where(
                        'trip.date', '<=',
                        Carbon::parse($request['dateEnd'])->endOfDay()
                    );
                })
            ->when(!$authRole->support, function (Builder $query) use ($authRole) {
                $query->whereIn('trip.cityId', function (\Illuminate\Database\Query\Builder $query) use ($authRole){
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleId', $authRole->id);
                });
            })
            ->select(
                'discountCoupon.code',
                'discountCoupon.value',
                'discountCoupon.valueType',
                'trip.tripReference',
                'trip.date',
                'trip.endDate',
                'tripDiscountCoupon.oldPrice',
                'trip.price',
                'ud.name as driverName',
                'user.name as userName',
                'trip.status',
                'tripType.type as tripType',
                'tripPaymentForm.name as paymentForm',
                'tripCallType.name as callType',
                'city.nome as city'
            )
            ->get();
    }
}
