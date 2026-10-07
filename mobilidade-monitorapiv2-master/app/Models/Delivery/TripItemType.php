<?php

namespace App\Models\Delivery;

use Illuminate\Database\Eloquent\Model;

class TripItemType extends Model
{
    protected $table = 'tripItemType';

    const UPDATED_AT = null;
    const CREATED_AT = null;

    protected $fillable = [
        'name', 'picture'
    ];

    protected $hidden = ['statusId'];

    public function getPictureAttribute()
    {
        return env("IMAGE_STORAGE") . "tripItemType/{$this->attributes['picture']}";
    }
}
