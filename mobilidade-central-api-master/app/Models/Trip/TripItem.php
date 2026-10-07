<?php

namespace App\Models\Trip;

use Illuminate\Database\Eloquent\Model;

class TripItem extends Model
{
    const CREATED_AT = null;
    const UPDATED_AT = null;

    protected $table = 'tripItem';

    protected $fillable = [
        'tripItemTypeId',
        'title',
        'tripReference',
    ];
}
