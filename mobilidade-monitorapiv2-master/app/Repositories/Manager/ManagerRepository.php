<?php

namespace App\Repositories\Manager;

use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Manager\Manager;
use App\Models\User\User;
use App\Models\User\UserIndication;
use Illuminate\Database\Eloquent\Builder;

class ManagerRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(Manager::class);
    }

    public function getAllManagers(array $request = [])
    {
        return $this->getModel()::query()
            ->select('manager.*')
            ->with(['user' => function ($query) {
                $query->select('user.idUser', 'user.name', 'user.phone', 'user.email');
            }])
            ->when(isset($request['cityId']), function (Builder $query) use ($request) {
                $query->where('manager.cityId', $request['cityId']);
            })
            ->get();
    }

    public function findDrivers($userId, $page = null)
    {
        $query = UserIndication::query()
            ->select([
                'userIndication.userIndicatedId',
                'userIndicated.name AS indicated_name',
                'userIndicated.nickname AS indicated_nickname',
                'userIndicated.phone AS indicated_phone',
                'userIndicated.email AS indicated_email',
                'driver.profileImage',
                'city.nome AS cityName',
                'userIndication.created_at',
            ])
            ->join('manager', 'manager.userId', '=', 'userIndication.whoIndicatedId')
            ->join('user AS userIndicated', 'userIndicated.idUser', '=', 'userIndication.userIndicatedId')
            ->join('user AS userWhoIndicated', 'userWhoIndicated.idUser', '=', 'userIndication.whoIndicatedId')
            ->leftJoin('driver', 'userIndicated.idUser', '=', 'driver.userId')
            ->leftJoin('city', 'driver.cityId', '=', 'city.id')
            ->where('userIndication.whoIndicatedId', $userId)
            ->where('userIndication.statusId', StatusConst::ACTIVE)
            ->orderBy('userIndication.created_at', 'DESC');

        return $query->get();
    }

    public function getAllManagersSelect(string $data = null)
    {
        return User
            ::where('user.statusId', StatusConst::ACTIVE)
            ->where(function ($query) {
                $query->where('roleId', 1)
                    ->orWhere('roleId', 2)
                    ->orWhere('roleId', 3);
            })
            ->when(isset($data), function (Builder $query) use ($data) {
                $query->where('user.name', 'like', '%' . $data . '%');
            })
            ->select(
                'idUser',
                'user.name',
                'user.nickname',
                'user.email',
                'user.phone',
                'user.blocked',
                'userType.name as type',
            )
            ->join('levelAccess', 'levelAccess.userId', '=', 'user.idUser')
            ->join('userType', 'userType.idUserType', '=', 'levelAccess.userTypeId')
            ->get();
    }

    public function verifyUserIsManager(int $id)
    {
        return $this->getModel()::query()
            ->where('userId', $id)
            ->first();
    }
}
