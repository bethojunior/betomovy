<?php

namespace App\Models\Price\Dynamic;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DynamicArea extends Model
{
    use SoftDeletes;

    protected $table = 'dynamicArea';

    protected $fillable = [
        'name',
        'area',
        'multiplierValue',
        'active',
        'cityId',
        'startTime',
        'endTime'
    ];
}
