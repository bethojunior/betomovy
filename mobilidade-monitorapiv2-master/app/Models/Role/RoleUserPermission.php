<?php

namespace App\Models\Role;

use Illuminate\Database\Eloquent\Model;

class RoleUserPermission extends Model
{
    protected $table = 'roleUserPermissions';

    const CREATED_AT = null;
    const UPDATED_AT = null;

    protected $fillable = ['roleId', 'userGroupPermissionId'];

    public function userGroupPermission()
    {
        return $this->belongsTo(UserGroupPermission::class, 'userGroupPermissionId');
    }

    public function userGroup()
    {
        return $this->hasOneThrough(
            UserGroup::class,
            UserGroupPermission::class,
            'id',
            'id',
            'userGroupPermissionId',
            'userGroupId'
        );
    }
}
