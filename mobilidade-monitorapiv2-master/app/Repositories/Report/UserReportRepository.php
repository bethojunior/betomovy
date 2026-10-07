<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 22/10/2019
 * Time: 09:35
 */

namespace App\Repositories\Report;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Role\Role;
use App\Models\User\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\JoinClause;

class UserReportRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(User::class);
    }

    public function countReferredUsers(array $queryRequest = [], Role $authRole = null)
    {
        return $this->getModel()
            ::where('user.statusId', StatusConst::ACTIVE)
            ->whereNotNull('userIndications')
            ->select('idUser','user.name', 'email', 'phone', 'userType.name AS userType')
            ->selectRaw('IFNULL(userIndications, 0) AS userIndications')
            ->selectRaw('IFNULL((
                    SELECT
                        rm.label
                    FROM referralMonetization rm
                        WHERE
                              userIndications >= rm.indications AND
                              rm.statusId = 1
                    ORDER BY rm.indications DESC
                    LIMIT 1
                ), \' - \') AS level')
            ->join('levelAccess', 'levelAccess.userId', '=', 'idUser')
            ->join('userType', 'userType.idUserType', '=', 'levelAccess.userTypeId')
            ->leftJoin('user_indication_view', 'whoIndicatedId', '=', 'idUser')
            ->whereNotIn('levelAccess.userTypeId', [1,2,4,6,9,10])
            ->orderByDesc('userIndications')
            ->when(isset($queryRequest['name']), function (Builder $query) use ($queryRequest){
                $query
                    ->where('user.name', 'LIKE', "%{$queryRequest['name']}%");
            })
            ->when(isset($queryRequest['monetizationId']), function (Builder $query) use ($queryRequest){
                $query
                    ->whereRaw("
                        (
                            SELECT
                                rm.id
                            FROM referralMonetization rm
                                WHERE
                                      userIndications >= rm.indications AND
                                      rm.statusId = 1
                            ORDER BY rm.indications DESc
                            LIMIT 1
                        ) = ?
                    ", [$queryRequest['monetizationId']]);
            })
            ->when(isset($authRole) && !$authRole->support, function (Builder $query) use ($authRole) {
                $query->leftJoin('driver', 'user.idUser', 'driver.userId')
                    ->join('cityArea', function (JoinClause $join) use ($authRole) {
                        $join->where('cityArea.statusId', StatusConst::ACTIVE)
                            ->whereIn('cityArea.cityId', function (\Illuminate\Database\Query\Builder $query) use ($authRole) {
                                $query->select('cityId')
                                    ->from('roleCity')
                                    ->where('roleId', $authRole->id);
                            })
                            ->whereRaw('(
                            if(user_indication_view.isDriver, driver.cityId = cityArea.cityId,
                               (user.cityId = cityArea.cityId or ST_CONTAINS(cityArea.polygon,
                                                                             POINT(user.last_lat, user.last_lon))))
                            )');
                    });
            })
            ->when((isset($queryRequest['paginate']) && $queryRequest['paginate'] == 1),
                function ($query){
                    return
                        $query->paginate();
                },
                function ($query) {
                    return $query->get();
                });
    }
}
