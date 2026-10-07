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
        $role = Auth::user()->role;

        return $this->getQuery()
            ->join('levelAccess', 'levelAccess.userId', '=', 'user.idUser')
            ->join('role', 'user.roleId', '=', 'role.id')
            ->where('user.statusId', StatusConst::ACTIVE)
            ->where('levelAccess.userTypeId', UserTypeConst::ADMIN)
            ->when(!$role->isRoot, function ($query) {
                return $query->where('role.isRoot', false);
            })
            ->select(
                'user.idUser',
                'user.email',
                'user.name',
                'user.nickname',
                'user.phone',
                'user.blocked',
                'role.isRoot',
                'role.name as roleName'
            )
            ->get();
    }

    public function findByEmail(string $email): ?Model
    {
        return $this->getQuery()
            ->join('levelAccess', 'levelAccess.userId', '=', 'user.idUser')
            ->where('email', $email)
            ->where('statusId', StatusConst::ACTIVE)
            ->where('levelAccess.userTypeId', UserTypeConst::ADMIN)
            ->first();
    }

    public function findById($id): ?Model
    {
        return $this->getQuery()
            ->join('levelAccess', 'levelAccess.userId', '=', 'user.idUser')
            ->join('role', 'user.roleId', '=', 'role.id')
            ->where('user.idUser', $id)
            ->where('user.statusId', StatusConst::ACTIVE)
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
                'role.isRoot',
                'role.name as roleName'
            )
            ->first();
    }

    public function findByEmailExceptId(string $email, $id): ?Model
    {
        return $this->getQuery()
            ->join('levelAccess', 'levelAccess.userId', '=', 'user.idUser')
            ->where('email', $email)
            ->where('user.idUser', '!=', $id)
            ->where('statusId', StatusConst::ACTIVE)
            ->where('levelAccess.userTypeId', UserTypeConst::ADMIN)
            ->first();
    }
}
