<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 03/07/2019
 * Time: 11:29
 */

namespace App\Repositories\User;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\User\Partner;
use App\Models\User\User;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\DB;

class PartnerRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(Partner::class);
    }

    public function findAll(array $request, User $user, int $cityId = null): Paginator
    {
        return $this->getModel()::join('user', 'user.idUser', 'partner.userId')
            ->join('customer', 'customer.userId', 'user.idUser')
            ->join('partnerRegisterStatus', 'partnerRegisterStatus.id', 'partner.partnerRegisterStatusId')
            ->join('cityArea', function (JoinClause $join) use ($cityId, $user) {
                $join->on('cityArea.statusId', DB::raw(StatusConst::ACTIVE))
                    ->when(!$user->role->support && isset($cityId), function (\Illuminate\Database\Query\Builder $query) use ($cityId) {
                        $query->where('cityArea.cityId', $cityId);
                    })
                    ->whereIn('cityArea.cityId', function (\Illuminate\Database\Query\Builder $query) use ($user) {
                        $query->select('cityId')
                            ->from('roleCity')
                            ->where('roleCity.roleId', $user->roleId);
                    })
                    ->where(function (\Illuminate\Database\Query\Builder $query) {
                        $query->whereRaw('ST_Contains(cityArea.polygon, POINT(user.last_lat, user.last_lon))');
                    });
            })
            ->when(isset($request['email']), function (Builder $query) use ($request) {
                $query->where('user.email', 'like', "%{$request['email']}%");
            })
            ->when(isset($request['name']), function (Builder $query) use ($request) {
                $query->where('user.name', 'like', "%{$request['name']}%");
            })
            ->when(isset($request['partnerRegisterStatusId']), function (Builder $query) use ($request) {
                $query->where('partner.partnerRegisterStatusId', $request['partnerRegisterStatusId']);
            })
            ->select(
                'partner.idPartner',
                'partner.userId',
                'partner.nameEstablishment',
                'partner.addressEstablishment',
                'partner.latitude  AS establishmentLatitude',
                'partner.longitude AS establishmentLongitude',
                'partner.created_at',
                'partner.function',
                'partner.partnerRegisterStatusId',
                'partnerRegisterStatus.name    AS partnerRegister',
                'partner.statusId',
                'user.name',
                'user.nickname',
                'user.phone',
                'user.email',
                'user.last_lat',
                'user.last_lon',
                'customer.profileImage'
            )
            ->orderByDesc('partner.created_at')
            ->paginate($request['per_page'] ?? 20);
    }

    public function findByUser($userId)
    {
        return $this->getModel()
            ::where('userId', $userId)
            ->where('statusId', StatusConst::ACTIVE)
            ->first();
    }
}
