<?php

namespace App\Models\Central;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Neighborhood extends Model
{
    use SoftDeletes;

    protected $table = 'neighborhood';

    protected $fillable = [
        'name',
        'area',
        'cityId'
    ];
}
