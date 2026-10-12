<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 30/08/2019
 * Time: 16:22
 */

namespace App\Helpers\Role;


use App\Models\Role\Role;
use App\Models\Role\RoleCity;
use App\Models\Role\RoleUserPermission;
use App\Repositories\Role\RoleRepository;
use App\Repositories\Role\RoleUserPermissionRepository;

class RoleHelper
{
    /**
     * @var RoleRepository
     */
    private $repository;
    /**
     * @var RoleUserPermissionRepository
     */
    private $roleUserPermissionRepository;

    public function __construct(RoleRepository $repository,
                                RoleUserPermissionRepository $roleUserPermissionRepository)
    {
        $this->repository = $repository;
        $this->roleUserPermissionRepository = $roleUserPermissionRepository;
    }

    public function findFully($id)
    {
        /** @var Role|null $role */
        $role = $id ? $this->repository->find($id) : null;

        if (!$role) {
            return [
                'name' => 'Administrador',
                'groups' => collect([])
            ];
        }

        $groups = $this->roleUserPermissionRepository
            ->findGroupedByRole($role->id);

        return [
            'name' => $role->name,
            'groups' => $groups ? $groups->map(function (RoleUserPermission $roleUserPermission){
                $permissions = array_values(array_unique(explode(',', $roleUserPermission->permissions)));
                return [
                    'name' => $roleUserPermission->groupPermission,
                    'permissions' => $permissions
                ];
            }) : collect([])
        ];
    }
}
