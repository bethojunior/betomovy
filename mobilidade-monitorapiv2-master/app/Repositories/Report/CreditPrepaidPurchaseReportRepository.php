<?php


namespace App\Repositories\Report;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Balance\CreditPrepaidPurchase;
use App\Models\Role\Role;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class CreditPrepaidPurchaseReportRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(CreditPrepaidPurchase::class);
    }

    public function findAll(array $request, Role $authRole)
    {
        return $this->getModel()::join('creditPrepaid', 'creditPrepaidPurchase.creditPrepaidId', 'creditPrepaid.id')
            ->join('user', 'creditPrepaidPurchase.userId', 'user.idUser')
            ->join('driver', 'user.idUser', 'driver.userId')
            ->select(
                'driver.idDriver',
                'user.name as driverName',
                'creditPrepaid.stripe',
                'creditPrepaid.purchasePrice',
                'creditPrepaid.sellPrice',
                DB::raw('
                    CASE
                       WHEN credited THEN \'Creditado\'
                       WHEN refused THEN \'Rejeitado\'
                       ELSE \'Em Análise\'
                       END AS status
                '),
                'creditPrepaidPurchase.created_at'
            )
            ->when(isset($request['driverId']), function (Builder $query) use ($request) {
                $query->where('driver.idDriver', $request['driverId']);
            })
            ->when(isset($request['dateStart']), function (Builder $query) use ($request) {
                $query->where('creditPrepaidPurchase.created_at', '>=', Carbon::parse($request['dateStart'])->startOfDay());
            })
            ->when(isset($request['dateEnd']), function (Builder $query) use ($request) {
                $query->where('creditPrepaidPurchase.created_at', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
            })
            ->when(!$authRole->support, function (Builder $query) use ($authRole) {
                $query->whereIn('driver.cityId', function (\Illuminate\Database\Query\Builder $query) use ($authRole) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleId', $authRole->id);
                });
            })
            ->get();
    }
}
