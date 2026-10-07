<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 25/09/2019
 * Time: 15:15
 */

namespace App\Repositories\Role;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Role\UserGroup;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\DB;

class UserGroupRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(UserGroup::class);
    }

    public function findAll()
    {
        return $this->getModel()
            ::all('id', 'name');
    }

    public function findByRoleWithPermissions(int $roleId, bool $authIsRoot = false)
    {
        return $this->getModel()
            ::select('id', 'name')
            ->with([
                'userGroupPermissions' => function (HasMany $query) use ($roleId, $authIsRoot) {
                    $query
                        ->when($authIsRoot, function (Builder $query) use ($roleId) {
                            $query->leftJoin('roleUserPermissions', function (JoinClause $join) use ($roleId) {
                                $join->on('roleUserPermissions.userGroupPermissionId', '=', 'userGroupPermissions.id')
                                    ->where('roleUserPermissions.roleId', $roleId);
                            });
                        }, function (Builder $query) use ($roleId) {
                            $query->join('roleUserPermissions', function (JoinClause $join) use ($roleId) {
                                $join->on('roleUserPermissions.userGroupPermissionId', '=', 'userGroupPermissions.id')
                                    ->where('roleUserPermissions.roleId', $roleId);
                            });
                        })
                        ->where('userGroupPermissions.statusId', StatusConst::ACTIVE)
                        ->distinct()
                        ->select(
                            'userGroupPermissions.id',
                            'userGroupPermissions.name',
                            'userGroupPermissions.description',
                            'userGroupId',
                            DB::raw('if(roleUserPermissions.statusId is not null, roleUserPermissions.statusId, 2) as statusId')
                        );
                }])
            ->when(!$authIsRoot, function (Builder $query) use ($roleId) {
                $query->whereHas('userGroupPermissions', function (Builder $query) use ($roleId) {
                    $query->join('roleUserPermissions', function (JoinClause $join) use ($roleId) {
                        $join->on('roleUserPermissions.userGroupPermissionId', '=', 'userGroupPermissions.id')
                            ->where('roleUserPermissions.roleId', $roleId);
                    })
                        ->where('userGroupPermissions.statusId', StatusConst::ACTIVE);
                });
            })
            ->where('statusId', StatusConst::ACTIVE)
            ->get();
    }

    public function findWithLastNotificationsNotRead()
    {
        return $this->getModel()
            ::whereHas('adminNotifications', function ($query) {
                $query
                    ->where('read', 0);
            })
            ->with(['adminNotifications' => function (HasMany $query) {
                $query
                    ->with([
                        'user' => function (BelongsTo $query) {
                            $query
                                ->select('idUser', 'user.name', 'user.phone', 'email', 'idDriver')
                                ->leftJoin('customer', 'customer.userId', '=', 'idUser')
                                ->leftJoin('driver', 'driver.userId', '=', 'idUser')
                                ->selectRaw(
                                    '
                                    CONCAT(
                                        (
                                            SELECT
                                                value
                                            FROM config
                                                WHERE `key` = \'link_storage_pictures\'
                                        ),
                                        IF(
                                            driver.profileImage = null,
                                            \'customer/profile/\',
                                            \'driver/profile/\'
                                        ),
                                        IFNULL(driver.profileImage, customer.profileImage)
                                    ) AS profileImage');
                        },
                        'adminNotificationType' => function (BelongsTo $query) {
                            $query
                                ->select('id', 'name', 'notifiable');
                        },
                        'emergencyMonitoringType'
                    ])
                    ->where('read', 0)
                    ->orderByDesc('created_at');
            }])
            ->get(['id', 'name']);
    }
}
