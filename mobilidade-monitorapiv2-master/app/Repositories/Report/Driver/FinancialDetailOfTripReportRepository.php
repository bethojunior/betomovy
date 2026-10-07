<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 12/03/2020
 * Time: 17:09
 */

namespace App\Repositories\Report\Driver;


use App\Contracts\Repository\AbstractRepository;
use App\Models\ReadOnly\View\FinancialDetailOfTripRO;
use App\Models\Role\Role;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class FinancialDetailOfTripReportRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(FinancialDetailOfTripRO::class);
    }

    public function getAll(array $request)
    {
        return $this->getQuery()
            ->select(
                'date',
                'customerName',
                'paymentForm',
                'typeOfRepass',
                'price',
                'appFee',
                'anotherFee',
                'paymentFormFee',
                'customerCancellationFee',
                'reward',
                'netValue',
                'tripReference',
                'driverId'
            )
            ->when(isset($request['driverId']), function (Builder $query) use ($request) {
                $query->where('driverId', $request['driverId']);
            })
            ->when(isset($request['date']), function (Builder $query) use ($request) {
                $date = explode(',', $request['date']);
                $query->whereBetween('date', [$date[0], $date[1]]);
            })
            ->get();
    }

    /**
     * @param $driverId
     * @param array $request
     * @return Builder[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Eloquent\Model[]|mixed[]
     */
    public function findByDriver($driverId, array $request)
    {
        return $this->getModel()
            ::where('driverId', $driverId)
            ->select(
                'date',
                'customerName',
                'originAddress',
                'destinationAddress',
                'paymentForm',
                'price',
                DB::raw('round(appFee,2) as appFee'),
                DB::raw('round(anotherFee,2) as anotherFee'),
                DB::raw('round(paymentFormFee,2) as paymentFormFee'),
                DB::raw('round(customerCancellationFee,2) as customerCancellationFee'),
                DB::raw('round(reward,2) as reward'),
                DB::raw('round(price - round(appFee,2) - round(anotherFee,2) - round(paymentFormFee,2) - round(customerCancellationFee,2) + round(reward,2), 2) as netValue')
            )
            ->when(isset($request['dateStart']), function (Builder $query) use ($request) {
                $query->where('date', '>=', Carbon::parse($request['dateStart'])->startOfDay());
            })
            ->when(isset($request['dateEnd']), function (Builder $query) use ($request) {
                $query->where('date', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
            })
            ->when(isset($request['tripPaymentFormId']), function (Builder $query) use ($request) {
                $query->where('tripPaymentFormId', $request['tripPaymentFormId']);
            })
            ->get();
    }

    public function financialTripDriversLessFilter(array $request = [], Role $authRole = null)
    {
        return $this->getModel()
            ::query()->when(isset($request['dateStart']), function (Builder $query) use ($request) {
                $query->where('date', '>=', Carbon::parse($request['dateStart'])->startOfDay());
            })
            ->when(isset($request['dateEnd']), function (Builder $query) use ($request) {
                $query->where('date', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
            })
            ->when(isset($authRole) && !$authRole->support, function (Builder $query) use ($authRole) {
                $query->whereIn('cityId', function (\Illuminate\Database\Query\Builder $query) use ($authRole) {
                        $query->select('roleCity.cityId')
                            ->from('roleCity')
                            ->where('roleCity.roleId', $authRole->id);
                    });
            })
            ->when(isset($request['tripPaymentFormId']), function (Builder $query) use ($request) {
                $query
                    ->where('tripPaymentFormId', $request['tripPaymentFormId']);
            })
            ->get();
    }
}
