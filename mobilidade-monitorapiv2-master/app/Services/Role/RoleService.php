<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 25/09/2019
 * Time: 09:26
 */

namespace App\Services\Role;


use App\Constants\StatusConst;
use App\Models\Role\Role;
use App\Repositories\Role\RoleCityRepository;
use App\Repositories\Role\RoleRepository;
use App\Repositories\Role\UserGroupRepository;
use Illuminate\Support\Facades\Auth;

class RoleService
{
    /**
     * @var RoleRepository
     */
    private $repository;
    /**
     * @var UserGroupRepository
     */
    private $userGroupRepository;
    /**
     * @var RoleCityRepository
     */
    private $roleCityRepository;

    public function __construct(RoleRepository $repository,
                                UserGroupRepository $userGroupRepository,
                                RoleCityRepository $roleCityRepository)
    {
        $this->repository = $repository;
        $this->userGroupRepository = $userGroupRepository;
        $this->roleCityRepository = $roleCityRepository;
    }

    public function findAll($userId, $id = null)
    {
        if ($id)
            return $this->findOne($id);

        if (!$userId && Auth::check()) {
            $userId = Auth::id() ?? (Auth::user() ? Auth::user()->idUser : null);
        }

        $roleLogged = $userId ? $this->repository->findByUser($userId) : null;
        if (!$roleLogged && Auth::check() && Auth::user() && Auth::user()->role) {
            $roleLogged = Auth::user()->role;
        }

        $isRoot = $roleLogged ? (bool) $roleLogged->isRoot : true;

        return $this->repository
            ->findAll($isRoot);
    }

    private function findOne($roleId)
    {
        $role = $this->repository->findWithCity($roleId);

        $authIsRoot = false;
        if (Auth::check() && Auth::user() && Auth::user()->role) {
            $authIsRoot = (bool) Auth::user()->role->isRoot;
        }

        $role->permissions = $this->userGroupRepository
            ->findByRoleWithPermissions($roleId, $authIsRoot);

        return $role;
    }

    public function delete(int $id)
    {
        /** @var Role $role */
        $role = $this->repository->find($id);

        $role->statusId = StatusConst::REMOVED;

        return $this->repository->save($role);
    }
}
