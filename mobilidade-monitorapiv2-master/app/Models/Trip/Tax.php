<?php

namespace App\Models\Trip;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tax extends Model
{
    use SoftDeletes;

    protected $table = 'tax';
    protected $fillable = [
        'name',
        'value',
        'valueType',
        'description',
        'cityId',
        'tripTypeId',
        'chargeBy',
        'userId',
        'active',
    ];
}
