<?php

namespace App\Repositories\User;

use App\Constants\StatusConst;
use App\Constants\Users\UserTypeConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\User\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class AdminRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(User::class);
    }

    public function findAll(): Collection
    {
        $user = Auth::user();
        $role = $user ? $user->role : null;
        $isRoot = false;

        if ($role && isset($role->isRoot)) {
            $isRoot = (bool) $role->isRoot;
        } elseif ($user && isset($user->roleId) && (int) $user->roleId === 1) {
            $isRoot = true;
        }

        return $this->getQuery()
            ->join('levelAccess', 'levelAccess.userId', '=', 'user.idUser')
            ->leftJoin('role', 'user.roleId', '=', 'role.id')
            ->where(function ($query) {
                $query->where('user.statusId', StatusConst::ACTIVE)
                      ->orWhereNull('user.statusId');
            })
            ->where('levelAccess.userTypeId', UserTypeConst::ADMIN)
            ->when(!$isRoot, function ($query) {
                return $query->where(function ($q) {
                    $q->where('role.isRoot', false)
                      ->orWhereNull('role.isRoot');
                });
            })
            ->select(
                'user.idUser',
                'user.email',
                'user.name',
                'user.nickname',
                'user.phone',
                'user.blocked',
                'user.roleId',
                \DB::raw('COALESCE(role.isRoot, 0) as isRoot'),
                \DB::raw('COALESCE(role.name, "Administrador") as roleName')
            )
            ->orderBy('user.idUser', 'desc')
            ->get();
    }

    public function findByEmail(string $email): ?Model
    {
        return $this->getQuery()
            ->join('levelAccess', 'levelAccess.userId', '=', 'user.idUser')
            ->where('email', $email)
            ->where(function ($query) {
                $query->where('user.statusId', StatusConst::ACTIVE)
                      ->orWhereNull('user.statusId');
            })
            ->where('levelAccess.userTypeId', UserTypeConst::ADMIN)
            ->first();
    }

    public function findById($id): ?Model
    {
        return $this->getQuery()
            ->join('levelAccess', 'levelAccess.userId', '=', 'user.idUser')
            ->leftJoin('role', 'user.roleId', '=', 'role.id')
            ->where('user.idUser', $id)
            ->where(function ($query) {
                $query->where('user.statusId', StatusConst::ACTIVE)
                      ->orWhereNull('user.statusId');
            })
            ->where('levelAccess.userTypeId', UserTypeConst::ADMIN)
            ->select(
                'user.idUser',
                'user.email',
                'user.name',
                'user.nickname',
                'user.phone',
                'user.document',
                'user.blocked',
                'user.roleId',
                \DB::raw('COALESCE(role.isRoot, 0) as isRoot'),
                \DB::raw('COALESCE(role.name, "Administrador") as roleName')
            )
            ->first();
    }

    public function findByEmailExceptId(string $email, $id): ?Model
    {
        return $this->getQuery()
            ->join('levelAccess', 'levelAccess.userId', '=', 'user.idUser')
            ->where('email', $email)
            ->where('user.idUser', '!=', $id)
            ->where(function ($query) {
                $query->where('user.statusId', StatusConst::ACTIVE)
                      ->orWhereNull('user.statusId');
            })
            ->where('levelAccess.userTypeId', UserTypeConst::ADMIN)
            ->first();
    }
}
