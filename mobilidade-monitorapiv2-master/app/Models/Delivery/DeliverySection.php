<?php

namespace App\Models\Delivery;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class DeliverySection extends Model
{
    use SoftDeletes;

    protected $table = "deliverySection";

    protected $fillable = [
        "name",
        "description",
        "icon"
    ];

    public function getIconAttribute()
    {
        return $this->attributes['icon'] ?
            Storage::cloud()->url($this->attributes['icon']) : null;
    }
}
