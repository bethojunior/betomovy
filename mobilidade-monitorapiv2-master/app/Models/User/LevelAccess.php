<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Model;

class LevelAccess extends Model
{
    const UPDATED_AT = null;
    const CREATED_AT = null;

    protected $table = 'levelAccess';

    protected $primaryKey = 'idLevelAccess';

    protected $fillable = ['userTypeId', 'userId'];
}
