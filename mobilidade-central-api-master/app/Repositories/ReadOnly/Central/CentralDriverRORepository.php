<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 12/06/2019
 * Time: 17:27
 */

namespace App\Repositories\ReadOnly\Central;


use App\Constants\Central\CentralConst;
use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\ReadOnly\Central\CentralDriverRO;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class CentralDriverRORepository extends AbstractRepository
{
    private const DRIVER_POSITION_COLUMNS = [
        'driver.idDriver',
        'driver.last_lat AS latitude',
        'driver.last_lon AS longitude',
        'user.name',
        'user.nickname',
        'user.phone',
        'driver.profileImage',
        'user.rating',
        'driver.status',
        'userType.name AS userType',
        'iconMapDriver.link AS iconMapDriver',
    ];

    public function __construct()
    {
        $this->setModel(CentralDriverRO::class);
    }

    public function findDriversPositionsByCentral($centralId, $status, $centralCallDriver = null, ?int $cityId = null)
    {
        if ($centralCallDriver === CentralConst::ONLY_APP_DRIVERS) {
            $query = DB::connection('mysql_ro')
                ->table('driver')
                ->whereNotIn('driver.idDriver', function ($subQuery) {
                    $subQuery->select('driverId')
                        ->from('centralDriver')
                        ->where('statusId', StatusConst::ACTIVE);
                })
                ->join('user', 'user.idUser', '=', 'driver.userId')
                ->join('levelAccess', 'levelAccess.userId', '=', 'user.idUser')
                ->join('userType', 'userType.idUserType', '=', 'levelAccess.userTypeId')
                ->leftJoin('iconMapDriver', 'iconMapDriver.id', '=', 'userType.iconMapDriverId');

            if ($status) {
                $query->whereIn('driver.status', $status);
            }

            $this->applyCityFilter($query, $cityId);

            return $query->select(self::DRIVER_POSITION_COLUMNS)->get();
        }

        if ($centralCallDriver === CentralConst::ALL_DRIVERS) {
            $query = DB::connection('mysql_ro')
                ->table('driver')
                ->join('user', 'user.idUser', '=', 'driver.userId')
                ->join('levelAccess', 'levelAccess.userId', '=', 'user.idUser')
                ->join('userType', 'userType.idUserType', '=', 'levelAccess.userTypeId')
                ->leftJoin('iconMapDriver', 'iconMapDriver.id', '=', 'userType.iconMapDriverId');

            if ($status) {
                $query->whereIn('driver.status', $status);
            }

            $this->applyCityFilter($query, $cityId);

            return $query->select(self::DRIVER_POSITION_COLUMNS)->get();
        }

        $query = $this->getModel()
            ::where('centralDriver.centralId', $centralId)
            ->where('centralDriver.statusId', StatusConst::ACTIVE)
            ->when($status, function (Builder $query, $value){
                $query->whereIn('driver.status', $value);
            })
            ->join('driver', 'centralDriver.driverId', '=', 'driver.idDriver')
            ->join('user', 'user.idUser', '=', 'driver.userId')
            ->join('levelAccess', 'levelAccess.userId', '=', 'user.idUser')
            ->join('userType', 'userType.idUserType', '=', 'levelAccess.userTypeId')
            ->leftJoin('iconMapDriver', 'iconMapDriver.id', '=', 'userType.iconMapDriverId');

        $this->applyCityFilter($query, $cityId);

        return $query->select(self::DRIVER_POSITION_COLUMNS)->get();
    }

    private function applyCityFilter($query, ?int $cityId): void
    {
        if (!$cityId) {
            return;
        }

        $query->whereExists(function ($subQuery) use ($cityId) {
            $subQuery->select(DB::raw(1))
                ->from('cityArea')
                ->where('cityArea.cityId', $cityId)
                ->where('cityArea.statusId', StatusConst::ACTIVE)
                ->whereRaw('ST_CONTAINS(cityArea.polygon, POINT(CAST(driver.last_lat AS DECIMAL(10,8)), CAST(driver.last_lon AS DECIMAL(10,8))))');
        });
    }
}
