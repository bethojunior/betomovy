<?php

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/06/2019
 * Time: 10:12
 */

namespace App\Repositories\User;


use App\Constants\StatusConst;
use App\Constants\Users\UserTypeConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\User\User;
use DB;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class UserRepository extends AbstractRepository
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

    public function find($userId, $columns = ['*'])
    {
        return $this->getModel()
            ::find($userId, $columns);
    }

    public function findForAuthProvider($userId)
    {
        /** @var User $user */
        $user = $this->getModel()
            ::where('idUser', $userId)
            ->select([
                'idUser',
                'name',
                'nickname',
                'document',
                'phone',
                'email',
                'password',
                'profilePhoto',
                'bankAccountId',
                'gender',
                'user.created_at',
                'updated_at',
                'roleId',
                'blocked',
                'user.statusId',
                'api_token',
            ])
            ->whereHas('userType', function (Builder $query) {
                $query->where('idUserType', UserTypeConst::ADMIN)
                    ->orWhere("idUserType", UserTypeConst::CUSTOMER);
            })
            ->where('statusId', StatusConst::ACTIVE)
            ->where('blocked', 0)
            ->first();

        return $user;
    }

    public function findByAuth($email, $password)
    {
        /** @var User $user */
        $user = $this->getModel()
            ::where('email', $email)
            ->where('password', $password)
            ->where('user.statusId', StatusConst::ACTIVE)
            ->where('blocked', 0)
            ->whereHas('userType', function (Builder $query) {
                $query->where('idUserType', UserTypeConst::ADMIN);
            })
            ->select(
                "idUser",
                "user.name",
                "nickname",
                "email",
                "api_token",
                "roleId",
                "role.support"
            )
            ->leftJoin('role', 'role.id', '=', 'user.roleId')
            ->first();

        return $user;
    }

    public function findByAuthCompany($email, $password)
    {
        /** @var User $user */
        $user = $this->getModel()
            ::where('email', $email)
            ->where('password', $password)
            ->where('statusId', StatusConst::ACTIVE)
            ->where('blocked', 0)
            ->whereHas('companyWorker', function ($query) {
                $query->where('statusId', StatusConst::ACTIVE);
            })
            ->with("companyWorker")
            ->first();

        return $user;
    }

    public function findByPhoneAndUserType(string $phone, int $userTypeId)
    {
        return $this->getModel()
            ::whereRaw(
                DB::raw(
                    "
                       TRIM(
                        REPLACE(
                             REPLACE(
                                 REPLACE(
                                     REPLACE(
                                         REPLACE(`phone`, '+', ''),
                                     ' ', ''),
                                 '(', ''),
                             ')', ''),
                         '-', '')
                       ) LIKE ?
                    "
                ),
                onlyCharacters($phone)
            )
            ->where('statusId', StatusConst::ACTIVE)
            ->where(function (Builder $query) use ($userTypeId) {
                $query
                    ->whereExists(function ($query) use ($userTypeId) {
                        $query->select(DB::raw(1))
                            ->from('levelAccess')
                            ->where('levelAccess.userTypeId', $userTypeId);
                    });
            })
            ->first();
    }

    public function findByEmailAndUserType(string $email, int $userTypeId)
    {
        return $this->getModel()
            ::where('email', $email)
            ->where('statusId', StatusConst::ACTIVE)
            ->whereDoesntHave('driver')
            ->whereDoesntHave('customer')
            ->where(function (Builder $query) use ($userTypeId) {
                $query
                    ->whereExists(function ($query) use ($userTypeId) {
                        $query->select(DB::raw(1))
                            ->from('levelAccess')
                            ->where('levelAccess.userTypeId', $userTypeId);
                    });
            })
            ->first();
    }

    public function getUsersForSendNotification(?int $cityId = null, ?array $userTypes = null)
    {
        return $this->getModel()::leftJoin('driver', 'user.idUser', 'driver.userId')
            ->whereNotNull('deviceToken')
            ->where('statusId', 1)
            ->when(isset($cityId), function (Builder $query) use ($cityId) {
                $query->where(function (Builder $q) use ($cityId) {
                    // Passageiro
                    $q->orWhere(fn($sub) => $this->filterByCityOrCoords($sub, 'user', $cityId));

                    // Motorista
                    $q->orWhere(fn($sub) => $this->filterByCityOrCoords($sub, 'driver', $cityId));
                });
            })
            ->when(isset($userTypes), function (Builder $query) use ($userTypes) {
                $query->join('levelAccess', 'user.idUser', 'levelAccess.userId')
                    ->whereIn('levelAccess.userTypeId', $userTypes);
            })
            ->select('user.idUser', 'user.deviceToken')
            ->get();
    }

    public function getUsersForSendNotificationPaginated(
        array $cityId = [],
        ?array $userTypes = null,
        int $page = 0,
        int $limit = 500
    ) {
        return $this->getModel()::leftJoin('driver', 'user.idUser', 'driver.userId')
            ->whereNotNull('deviceToken')
            ->where('statusId', 1)
            ->when(!empty($cityId), function (Builder $query) use ($cityId) {
                $query->where(function (Builder $q) use ($cityId) {
                    foreach ($cityId as $id) {
                        // Passageiro
                        $q->orWhere(fn($sub) => $this->filterByCityOrCoords($sub, 'user', $id));

                        // Motorista
                        $q->orWhere(fn($sub) => $this->filterByCityOrCoords($sub, 'driver', $id));
                    }
                });
            })
            ->when(isset($userTypes), function (Builder $query) use ($userTypes) {
                $query
                    ->join('levelAccess', 'user.idUser', 'levelAccess.userId')
                    ->whereIn('levelAccess.userTypeId', $userTypes);
            })
            ->select('user.idUser', 'user.deviceToken')
            ->offset($page * $limit)
            ->limit($limit)
            ->get();
    }

    private function filterByCityOrCoords(Builder $query, string $table, int $cityId): void
    {
        $lat = "{$table}.last_lat";
        $lon = "{$table}.last_lon";
        $city = "{$table}.cityId";

        $query->whereRaw("(
            $lat IS NOT NULL AND $lon IS NOT NULL 
            AND ST_CONTAINS(
                (SELECT polygon FROM cityArea WHERE cityArea.cityId = ? AND cityArea.statusId = 1),
                POINT($lat, $lon)
            )
        )", [$cityId]);

        $query->orWhere(function ($q) use ($lat, $lon, $city, $cityId) {
            $q->whereNull($lat)->whereNull($lon)->where($city, $cityId);
        });
    }

    public function getByType(int $userTypeId): Collection
    {
        return $this->getModel()::join('levelAccess', 'levelAccess.userId', '=', 'user.idUser')
            ->where('userTypeId', '=', $userTypeId)
            ->where('user.statusId', StatusConst::ACTIVE)
            ->select(
                'user.idUser',
                'user.name',
                'user.email',
                'user.phone',
                'user.document'
            )
            ->get();
    }

    public function getDependents(int $idUser)
    {
        return $this->getModel()::join('dependentUser', 'user.idUser', 'dependentUser.userId')
            ->select(
                'user.idUser',
                'user.name',
                'user.nickname',
                'user.phone',
                'user.email',
                'user.document',
                'dependentUser.relationship'
            )
            ->where('dependentUser.responsibleId', $idUser)
            ->where('user.statusId', StatusConst::ACTIVE)
            ->where('dependentUser.statusId', StatusConst::ACTIVE)
            ->get();
    }

    public function getResponsible(int $idUser)
    {
        return $this->getModel()::join('dependentUser', 'user.idUser', 'dependentUser.responsibleId')
            ->select(
                'dependentUser.responsibleId',
                'user.name',
                'user.nickname',
                'user.phone',
                'user.email',
                'user.document',
                'dependentUser.relationship'
            )
            ->where('dependentUser.userId', $idUser)
            ->where('user.statusId', StatusConst::ACTIVE)
            ->where('dependentUser.statusId', StatusConst::ACTIVE)
            ->first();
    }

    public function findByDateOfBirthOfToday()
    {
        return $this->getModel()
            ::whereNotNull("dateOfBirth")
            ->whereRaw("date_format(dateOfBirth, '%m-%d') = date_format(now(), '%m-%d')")
            ->where("statusId", StatusConst::ACTIVE)
            ->select([
                "deviceToken"
            ])
            ->get();
    }

    public function findByDateRegisterOfToday()
    {
        return $this->getModel()
            ::whereNotNull("created_at")
            ->whereRaw("date_format(created_at, '%m-%d') = date_format(now(), '%m-%d')")
            ->where("statusId", StatusConst::ACTIVE)
            ->select([
                "deviceToken"
            ])
            ->get();
    }

    public function getAllUsers(string $data = null)
    {
        return $this->getModel()
            ::where('user.statusId', StatusConst::ACTIVE)
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

    public function getAllUsersPanel(string $data = null)
    {
        return $this->getModel()
            ::where('user.statusId', StatusConst::ACTIVE)
            ->whereNotNull('user.roleId')
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

    /**
     * Usuários elegíveis pra serem vinculados como responsável de uma Central:
     * ativos, tipo passageiro (CUSTOMER), sem usuário de painel (roleId) e sem
     * relação com driver.
     */
    public function eligibleForCentral(string $search = null, int $page = 1)
    {
        $perPage = 20;

        return $this->getModel()
            ::where('user.statusId', StatusConst::ACTIVE)
            ->whereNull('user.roleId')
            ->whereExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('levelAccess')
                    ->whereColumn('levelAccess.userId', 'user.idUser')
                    ->where('levelAccess.userTypeId', UserTypeConst::CUSTOMER);
            })
            ->whereNotExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('driver')
                    ->whereColumn('driver.userId', 'user.idUser');
            })
            ->when(isset($search), function (Builder $query) use ($search) {
                $query->where(function (Builder $query) use ($search) {
                    $query->where('user.name', 'like', '%' . $search . '%')
                        ->orWhere('user.email', 'like', '%' . $search . '%');
                });
            })
            ->select(
                'idUser as id',
                'user.name as text',
                'user.email',
                'user.phone'
            )
            ->paginate($perPage, ['*'], 'page', $page);
    }

    /**
     * Mesma regra de eligibleForCentral(), aplicada a um único usuário.
     * Usada pelo backend pra validar `responsibleId` antes de vincular.
     */
    public function isEligibleForCentral($userId): bool
    {
        return $this->getModel()
            ::where('idUser', $userId)
            ->where('statusId', StatusConst::ACTIVE)
            ->whereNull('roleId')
            ->whereExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('levelAccess')
                    ->whereColumn('levelAccess.userId', 'user.idUser')
                    ->where('levelAccess.userTypeId', UserTypeConst::CUSTOMER);
            })
            ->whereNotExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('driver')
                    ->whereColumn('driver.userId', 'user.idUser');
            })
            ->exists();
    }

    public function findWithBalance($userId)
    {
        return $this->getModel()
            ::select('user.*')
            ->leftJoin('driver', 'driver.userId', '=', 'user.idUser')
            ->leftJoin('customer', 'customer.userId', '=', 'user.idUser')
            ->where('user.idUser', '=', $userId)
            ->first();
    }
}
