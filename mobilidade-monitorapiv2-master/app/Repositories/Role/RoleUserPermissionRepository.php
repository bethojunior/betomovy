<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 30/08/2019
 * Time: 16:33
 */

namespace App\Repositories\Role;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Role\RoleUserPermission;
use Illuminate\Database\Eloquent\Builder;

class RoleUserPermissionRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(RoleUserPermission::class);
    }

    public function findByRole($role_id)
    {
        return $this->getModel()
            ::select(
                'roleUserPermissions.id',
                'userGroupPermissionId',
                'userGroupPermissions.description as userGroupPermission',
                'roleUserPermissions.statusId',
                'roleUserPermissions.roleId'
            )
            ->join(
                'userGroupPermissions',
                'userGroupPermissions.id', '=', 'roleUserPermissions.userGroupPermissionId')
            ->where('roleUserPermissions.roleId', $role_id)
            ->where('userGroupPermissions.statusId', StatusConst::ACTIVE)
            ->get();
    }

    public function findGroupedByRole($roleId)
    {
        return $this->getModel()
            ::join(
                'userGroupPermissions', 'userGroupPermissionId', '=', 'userGroupPermissions.id')
            ->join('userGroup', 'userGroupId', '=', 'userGroup.id')
            ->selectRaw(
                "DISTINCT(userGroup.name) AS groupPermission,
                GROUP_CONCAT(userGroupPermissions.name) AS permissions,
                GROUP_CONCAT(userGroupPermissions.id) AS permissionsId
            ")
            ->where('roleUserPermissions.roleId', $roleId)
            ->where('roleUserPermissions.statusId', StatusConst::ACTIVE)
            ->groupBy('userGroup.id')
            ->get();
    }

    public function disableAllPermissions(int $roleId, bool $authIsRoot = false)
    {
        return $this->getModel()
            ::where('roleId', $roleId)
            ->when($authIsRoot, function (Builder $query) {
                $query->delete();
            }, function (Builder $query) {
                $query->update(['statusId' => StatusConst::REMOVED]);
            });
    }

    public function activePermissions(int $roleId, array $userGroupPermissionIds): int
    {
        return $this->getModel()
            ::query()->where('roleId', $roleId)
            ->whereIn('userGroupPermissionId', $userGroupPermissionIds)
            ->update(['statusId' => StatusConst::ACTIVE]);
    }

    public function hasPermission(int $roleId, string $groupName, string $permissionName): bool
    {
        return $this->getModel()
            ::join('userGroupPermissions', 'userGroupPermissions.id', '=', 'roleUserPermissions.userGroupPermissionId')
            ->join('userGroup', 'userGroup.id', '=', 'userGroupPermissions.userGroupId')
            ->where('roleUserPermissions.roleId', $roleId)
            ->where('roleUserPermissions.statusId', StatusConst::ACTIVE)
            ->where('userGroupPermissions.name', $permissionName)
            ->where('userGroupPermissions.statusId', StatusConst::ACTIVE)
            ->where('userGroup.name', $groupName)
            ->exists();
    }
}
