<?php


namespace App\Repositories\Report;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Company\Company;
use App\Models\Establishment\EstablishmentCollectionManagement;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\DB;

class EstablishmentCollectionManagementReportRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(EstablishmentCollectionManagement::class);
    }

    public function totalChargePerCompany(array $request, bool $isSupport = false, int $cityId = null)
    {
        return Company::query()->leftJoin('deliveryOrder as dO', function (JoinClause $join) use ($request) {
            $join->on('company.id', 'dO.companyId')
                ->when(isset($request['dateStart']), function ($query) use ($request) {
                    $query->where('dO.created_at', '>=', Carbon::parse($request['dateStart'])->startOfDay());
                })
                ->when(isset($request['dateEnd']), function ($query) use ($request) {
                    $query->where('dO.created_at', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
                });
        })
            ->leftJoin('establishmentCollectionManagement as eCM', 'dO.establishmentCollectionManagementId', 'eCM.id')
            ->select(
                'company.id as idCompany',
                'company.fantasyName as company',
                DB::raw('COALESCE(COUNT(dO.value), 0) as quantityOrder'),
                DB::raw('ROUND(COALESCE(SUM(dO.value), 0), 2) as valueOrder'),
                DB::raw('ROUND(SUM(IF(dO.value IS NOT NULL, COALESCE(eCM.orderValue, 0), 0)), 2) as chargeOrderValue'),
                DB::raw('COALESCE(SUM(ROUND(COALESCE(eCM.orderPercentage, 0) * (dO.value / 100), 2)), 0) as chargeOrderPercentage'),
                DB::raw('ROUND(SUM(IF(dO.value IS NOT NULL, COALESCE(eCM.orderValue, 0), 0)) +
                      COALESCE(SUM(ROUND(COALESCE(eCM.orderPercentage, 0) * (dO.value / 100), 2)), 0), 2) as chargeTotal')
            )
            ->when(isset($request['companyId']), function (Builder $query) use ($request) {
                $query->where('company.id', $request['companyId']);
            })
            ->when(!$isSupport && isset($cityId), function (Builder $query) use ($cityId) {
                $query->where('company.cityId', $cityId);
            })
            ->groupBy('company.id')
            ->get();
    }
}
