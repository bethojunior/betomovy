<?php

namespace App\Models\Role;

use Illuminate\Database\Eloquent\Model;

class RoleCity extends Model
{
    protected $table = 'roleCity';

    const CREATED_AT = null;
    const UPDATED_AT = null;

    protected $fillable = ['roleId', 'cityId'];
}
