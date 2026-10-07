<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 25/09/2019
 * Time: 13:52
 */

namespace App\Services\Role;


use App\Models\User\User;
use App\Repositories\Role\RoleUserPermissionRepository;
use App\Repositories\Role\UserGroupRepository;

class RoleUserPermissionService
{
    private $repository;
    private $permissionRepository;

    public function __construct(UserGroupRepository $repository, RoleUserPermissionRepository $permissionRepository)
    {
        $this->repository = $repository;
        $this->permissionRepository = $permissionRepository;
    }

    public function findAll(User $user)
    {
        return $this->repository
            ->findByRoleWithPermissions($user->roleId, (bool)$user->role->isRoot);
    }

    public function hasPermission(User $user, string $groupName, string $permissionName): bool
    {
        if (!$user->roleId) {
            return false;
        }

        return $this->permissionRepository->hasPermission($user->roleId, $groupName, $permissionName);
    }
}
