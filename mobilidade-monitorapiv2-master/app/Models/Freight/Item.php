<?php

namespace App\Models\Freight;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $table = 'items';

    protected $fillable = [
        'description', 'weight', 'height', 'width', 'depth', 'picture'
    ];

    public function getPictureAttribute()
    {
        return env("IMAGE_STORAGE") . "item/{$this->attributes['picture']}";
    }
}
