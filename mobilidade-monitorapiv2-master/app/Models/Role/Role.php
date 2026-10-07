<?php

namespace App\Models\Role;

use App\Models\Locale\City;
use App\Models\User\User;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $table = 'role';

    public function cities()
    {
        return $this->hasManyThrough(
            City::class,
            RoleCity::class,
            'roleId',
            'id',
            'id',
            'cityId'
        );
    }

    public function roleCities()
    {
        return $this->hasMany(RoleCity::class, 'roleId');
    }

    public function roleUserPermissions()
    {
        return $this->hasMany(RoleUserPermission::class, 'roleId');
    }

    public function users()
    {
        return $this->hasMany(User::class, 'roleId');
    }
}
