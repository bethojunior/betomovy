<?php

namespace App\Models\Military;

use Illuminate\Database\Eloquent\Model;

class MilitaryForce extends Model
{
    protected $table = 'militaryForce';

    protected $fillable = [
        'name'
    ];

    const UPDATED_AT = null;
    const CREATED_AT =  null;
}
