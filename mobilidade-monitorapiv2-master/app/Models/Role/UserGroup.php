<?php

namespace App\Models\Role;

use App\Models\Notification\AdminNotification;
use Illuminate\Database\Eloquent\Model;

class UserGroup extends Model
{
    protected $table = 'userGroup';

    public function userGroupPermissions()
    {
        return $this->hasMany(UserGroupPermission::class, 'userGroupId');
    }

    public function adminNotifications()
    {
        return $this->hasMany(AdminNotification::class, 'userGroupId');
    }
}
