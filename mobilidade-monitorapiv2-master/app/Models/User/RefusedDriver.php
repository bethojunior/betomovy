<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Model;

class RefusedDriver extends Model
{
    protected $table = 'refusedDriver';

    protected $primaryKey = 'id';
}
