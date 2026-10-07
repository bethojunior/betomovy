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

        $roleLogged = $this->repository
            ->findByUser($userId);

        return $this->repository
            ->findAll($roleLogged->isRoot);
    }

    private function findOne($roleId)
    {
        $role = $this->repository->findWithCity($roleId);

        $role->permissions = $this->userGroupRepository
            ->findByRoleWithPermissions($roleId, (bool)(Auth::user())->role->isRoot);

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
