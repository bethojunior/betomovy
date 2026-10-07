<?php


namespace App\Repositories\Route;


use App\Constants\StatusConst;
use App\Constants\Trip\TripConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Route\ScheduleCorporateRoute;
use App\Models\Trip\Trip;
use Illuminate\Database\Eloquent\Builder;
use Jenssegers\Mongodb\Relations\BelongsTo;

class ScheduleCorporateRouteRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(ScheduleCorporateRoute::class);
    }


    public function findScheduleByCompany($companyId)
    {
        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->whereHas("corporateRoute", function (Builder $query) use ($companyId) {
                return $query->where("companyId", $companyId);
            })
            ->with(["corporateRoute" => function ($query) {
                $query->with("route");
            }])
            ->with(['days' => function ($query) {
                $query->where('statusId', StatusConst::ACTIVE);
            }])
            ->get();
    }

    public function findScheduleCompanyByDate($companyId, $date)
    {
        return $this->getModel()
            ::where('scheduleCorporateRoute.statusId', StatusConst::ACTIVE)
            ->with(["corporateRoute" => function ($query) use ($companyId) {
                $query->with("route")->whereRaw("corporateRoute.companyId = ?", [$companyId]);
            }])
            ->join("scheduleCorporateRouteWeek", "scheduleCorporateRouteId","=", "scheduleCorporateRoute.id")
            ->whereRaw("(WEEKDAY(?) + 1) = scheduleCorporateRouteWeek.day AND scheduleCorporateRouteWeek.statusId", [$date, StatusConst::ACTIVE])
            ->selectRaw("scheduleCorporateRoute.*, EXISTS(SELECT *
                    FROM trip t
                             INNER JOIN tripScheduled tS on t.tripReference = tS.tripReference
                    WHERE DATE(tS.schedule) = ?
                      AND t.status = ?
                      AND t.scheduleCorporateRouteId = scheduleCorporateRoute.id) as isConfirm",
                [$date,TripConst::SCHEDULED])
            ->groupBy(["scheduleCorporateRoute.id"])
            ->get();
    }

    public function findWithDays($id)
    {
        return $this->getModel()
            ::where("id", $id)
            ->with(["days" => function ($query) {
                return $query->where('statusId', StatusConst::ACTIVE);
            }])
            ->first();
    }
}
