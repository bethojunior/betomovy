<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 25/09/2019
 * Time: 15:42
 */

namespace App\Services\Role;


use App\Models\Role\Role;
use App\Repositories\Role\RoleCityRepository;
use App\Repositories\Role\RoleRepository;
use App\Repositories\Role\RoleUserPermissionRepository;
use Illuminate\Support\Facades\Auth;

class InsertRoleService
{
    /**
     * @var RoleRepository
     */
    private $repository;
    /**
     * @var RoleCityRepository
     */
    private $roleCityRepository;
    /**
     * @var RoleUserPermissionRepository
     */
    private $roleUserPermissionRepository;

    public function __construct(RoleRepository               $repository,
                                RoleCityRepository           $roleCityRepository,
                                RoleUserPermissionRepository $roleUserPermissionRepository)
    {
        $this->repository = $repository;
        $this->roleCityRepository = $roleCityRepository;
        $this->roleUserPermissionRepository = $roleUserPermissionRepository;
    }

    /**
     * @param $request
     * @return Role
     * @throws \Exception
     */
    public function insert($request)
    {
        try {
            \DB::beginTransaction();

            $role = new Role;
            $role->support = $request['support'];
            $role->name = $request['name'];

            $this->repository
                ->save($role);

            $this->feedRoleCities($role, $request['cities']);

            $this->feedRoleUserPermissions($role, $request['permissions']);

            \DB::commit();

        } catch (\Exception $e) {
            \DB::rollBack();

            throw $e;
        }

        return $role;
    }

    /**
     * @param int $id
     * @param array $request
     * @return Role
     * @throws \Exception
     */
    public function update(int $id, array $request)
    {
        try {
            \DB::beginTransaction();

            /** @var Role $role */
            $role = $this->repository->find($id);
            $role->support = $request['support'] ?? $role->support;
            $role->name = $request['name'] ?? $role->name;

            $this->repository->save($role);

            $this->updateRoleUserPermissions($role, $request['permissions']);

            \DB::commit();

        } catch (\Exception $e) {
            \DB::rollBack();

            throw $e;
        }

        return $role;
    }

    /**
     * @param Role $role
     * @param $cities
     * @return bool
     */
    private function feedRoleCities(Role $role, $cities)
    {
        return $this->roleCityRepository
            ->createMany(array_map(function ($cityId) use ($role) {
                return [
                    'cityId' => $cityId,
                    'roleId' => $role->id,
                ];
            }, $cities));
    }

    private function feedRoleUserPermissions(Role $role, $permissions)
    {

        return $this->roleUserPermissionRepository
            ->createMany(array_map(function ($userGroupPermissionId) use ($role) {
                return [
                    'roleId' => $role->id,
                    'userGroupPermissionId' => $userGroupPermissionId
                ];
            }, $permissions));
    }

    private function updateRoleUserPermissions(Role $role, array $permissions)
    {
        $this->roleUserPermissionRepository
            ->disableAllPermissions($role->id, (bool)(Auth::user())->role->isRoot);

        if ((Auth::user())->role->isRoot) {
            return $this->feedRoleUserPermissions($role, $permissions);
        }

        $authRoleUserPermissions = $this->roleUserPermissionRepository->findByRole((Auth::user())->role->id);
        $authUserGroupPermissionIds = array_column($authRoleUserPermissions->toArray(), 'userGroupPermissionId');

        $userGroupPermissionIdsToActive = collect($permissions)->filter(function ($permission) use ($authUserGroupPermissionIds) {
            return in_array($permission, $authUserGroupPermissionIds);
        })->toArray();

        $roleUserPermissions = $this->roleUserPermissionRepository->findByRole($role->id);
        $userGroupPermissionIds = array_column($roleUserPermissions->toArray(), 'userGroupPermissionId');

        $userGroupPermissionIdsToCreate = collect($userGroupPermissionIdsToActive)->filter(function ($userGroupPermissionId) use ($userGroupPermissionIds) {
            return !in_array($userGroupPermissionId, $userGroupPermissionIds);
        })->toArray();

        $this->feedRoleUserPermissions($role, $userGroupPermissionIdsToCreate);

        return $this->roleUserPermissionRepository->activePermissions($role->id, $userGroupPermissionIdsToActive);
    }
}
