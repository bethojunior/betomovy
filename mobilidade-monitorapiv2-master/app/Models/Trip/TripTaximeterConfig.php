<?php

namespace App\Models\Trip;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TripTaximeterConfig extends Model
{
    use SoftDeletes;

    protected $table = 'tripTaximeterConfig';

    protected $fillable = [
        'cityId',
        'enableCancelButton'
    ];
}
