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
use App\Constants\Users\DriverConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Central\CentralDriver;
use App\Models\User\Customer;
use App\Models\User\FavoriteDriver;
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

    /**
     * @param $centralId
     * @param string|null $filter 'favorite' ou um status de App\Constants\Users\DriverConst (disponivel/corrida/desligado). Null = sem filtro (todos).
     */
    public function findActivesPerCentral($centralId, $filter = null)
    {
        return $this->getModel()
            ::where('centralDriver.statusId', 1)
            ->where('centralDriver.centralId', $centralId)
            ->when($filter === 'favorite', function (Builder $query) {
                $query->where('centralDriver.isFavorite', 1);
            })
            ->when(in_array($filter, DriverConst::STATUSES, true), function (Builder $query) use ($filter) {
                $query->where('driver.status', $filter);
            })
            ->join('driver', 'centralDriver.driverId', '=', 'driver.idDriver')
            ->join('user', 'driver.userId', '=', 'user.idUser')
            ->join('levelAccess', 'levelAccess.userId', '=', 'user.idUser')
            ->select([
                'driver.idDriver',
                'driver.profileImage',
                'driver.status',
                'user.name',
                'user.nickname',
                'user.phone',
                'levelAccess.userTypeId',
                'centralDriver.isFavorite'
                ])
            ->orderBy('isFavorite', 'desc')
            ->paginate(PaginationConst::LIMIT_PER_PAGE);
    }

    public function updateFavoriteDriver($request, $user)
    {
        $updated = $this->getModel()
            ::where('centralId', '=', $request['centralId'])
            ->where("driverId", '=', $request['driverId'])
            ->update(['isFavorite' => $request['isFavorite']]);

        $this->syncFavoriteDriver($request, $user);

        return $updated;
    }

    private function syncFavoriteDriver($request, $user)
    {
        $customer = Customer::where('userId', $user->idUser)->first();

        if (!$customer) {
            return;
        }

        $status = $request['isFavorite'] ? FavoriteDriver::STATUS_ATIVO : FavoriteDriver::STATUS_EXCLUIDO;

        $favorite = FavoriteDriver::where('customerId', $customer->idCustomer)
            ->where('driverId', $request['driverId'])
            ->first();

        if ($favorite) {
            $favorite->update(['status' => $status]);
            return;
        }

        FavoriteDriver::create([
            'customerId' => $customer->idCustomer,
            'driverId' => $request['driverId'],
            'status' => $status,
        ]);
    }

    public function findDriversPositionsByCentral($centralId, $status)
    {
        return $this->getModel()
            ::where('centralDriver.centralId', $centralId)
            ->where('centralDriver.statusId', StatusConst::ACTIVE)
            ->when($status, function (Builder $query, $value){
                $query
                    ->whereIn('driver.status', $value);
            })
            ->join('driver', 'centralDriver.driverId', '=', 'driver.idDriver')
            ->join('user', 'user.idUser', '=', 'driver.userId')
            ->join('levelAccess', 'levelAccess.userId', '=', 'user.idUser')
            ->join('userType', 'userType.idUserType', '=', 'levelAccess.userTypeId')
            ->leftJoin('iconMapDriver', 'iconMapDriver.id', '=', 'userType.iconMapDriverId')
            ->select([
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
            ])
            ->get();
    }

}
