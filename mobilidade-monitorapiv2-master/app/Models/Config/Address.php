<?php

namespace App\Models\Config;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $table = 'address';

    protected $fillable = [
        'latitude',
        'longitude',
        'address',
        'neighborhood',
        'blocked',
        'type',
        'manual'
    ];

    protected $hidden = ['statusId'];
}
