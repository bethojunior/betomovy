<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Model;

class BlacklistUser extends Model
{
    protected $primaryKey = 'idBlacklistUser';

    protected $table = 'blacklistUser';

    const UPDATED_AT = null;
}
