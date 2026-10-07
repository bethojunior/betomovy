<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Model;

class Partner extends Model
{
    const UPDATED_AT = null;

    protected $table = 'partner';

    protected $primaryKey = 'idPartner';

    protected $fillable = [
        'userId'
    ];
}
