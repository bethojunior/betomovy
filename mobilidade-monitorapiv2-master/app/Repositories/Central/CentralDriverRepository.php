<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 12/06/2019
 * Time: 17:27
 */

namespace App\Repositories\Central;


use App\Constants\PaginationConst;
use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Central\CentralDriver;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CentralDriverRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(CentralDriver::class);
    }

    public function findByCentralAndDriver($centralId, $driverId)
    {
        return $this->getModel()
            ::where('centralId', $centralId)
            ->where('driverId', $driverId)
            ->where('statusId', StatusConst::ACTIVE)
            ->first();
    }

    public function findDriversByCentral($centralId)
    {
        return $this->getModel()
            ::where('centralId', $centralId)
            ->where('statusId', StatusConst::ACTIVE)
            ->with(['driver' => function (BelongsTo $query){
                $query
                    ->select([
                        'idDriver',
                        'profileImage',
                        'last_lat AS latitude',
                        'last_lon AS longitude',
                        'driverRegisterStatusId',
                        'status',
                        'userId'
                    ])
                    ->with(['user' => function (BelongsTo $query){
                        $query
                            ->select([
                                'idUser',
                                'name',
                                'nickname',
                                'email',
                                'phone'
                            ]);
                    }]);
            }])
            ->paginate(PaginationConst::LIMIT_PER_PAGE);
    }

    public function findDriversPositionsByCentral($centralId, $status)
    {
        return $this->getModel()
            ::where('centralId', $centralId)
            ->where('centralDriver.statusId', StatusConst::ACTIVE)
            ->when($status, function (Builder $query, $value){
                $query
                    ->whereIn('driver.status', $value);
            })
            ->join('driver', 'idDriver', '=', 'driverId')
            ->join('user', 'idUser', '=', 'driver.userId')
            ->join('levelAccess', 'levelAccess.userId', '=', 'idUser')
            ->join('userType', 'idUserType', '=', 'userTypeId')
            ->select([
                'idDriver',
                'driver.last_lat AS latitude',
                'driver.last_lon AS longitude',
                'user.name',
                'nickname',
                'phone',
                'profileImage',
                'rating',
                'status',
                'userType.name AS userType',
            ])
            ->get();
    }
}
