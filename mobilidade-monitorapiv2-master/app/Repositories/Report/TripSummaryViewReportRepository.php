<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 31/03/2020
 * Time: 18:52
 */

namespace App\Repositories\Report;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Trip\TripSummaryView;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

class TripSummaryViewReportRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(TripSummaryView::class);
    }

    public function findAll(array $request = [])
    {
        return $this->getModel()
            ::when(isset($request['dateStart']), function (Builder $query) use ($request) {
                $query->where('date', '>=', Carbon::parse($request['dateStart'])->startOfDay());
            })
            ->when(isset($request['dateEnd']), function (Builder $query) use ($request) {
                $query->where('date', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
            })
            ->when(isset($request['tripPaymentFormId']), function (Builder $query) use ($request) {
                $query->where('tripPaymentFormId', $request['tripPaymentFormId']);
            })
            ->when(isset($request['tripCallTypeId']), function (Builder $query) use ($request) {
                $query->where('tripCallTypeId', $request['tripCallTypeId']);
            })
            ->when(isset($request['driverId']), function (Builder $query) use ($request) {
                $query->where('driverId', $request['driverId']);
            })
            ->when(isset($request['userId']), function (Builder $query) use ($request) {
                $query->where('userId', $request['userId']);
            })
            ->when(isset($request['cityId']), function (Builder $query) use ($request) {
                $query->where('cityId', $request['cityId']);
            })
            ->when(isset($request['status']), function (Builder $query) use ($request) {
                $query->where('status', $request['status']);
            })
            ->when(isset($request['tripTypeId']), function (Builder $query) use ($request) {
                $query->where('tripTypeId', $request['tripTypeId']);
            })
            ->when(isset($request['centralId']), function (Builder $query) use ($request) {
                $query->where('centralId', $request['centralId']);
            })
            ->get();
    }

}
