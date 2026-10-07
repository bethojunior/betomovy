<?php

namespace App\Models\Role;

use Illuminate\Database\Eloquent\Model;

class UserGroupPermission extends Model
{
    protected $table = 'userGroupPermissions';

    public function userGroup()
    {
        return $this->belongsTo(UserGroup::class, 'userGroupId');
    }
}
