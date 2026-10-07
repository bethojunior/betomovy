<?php

namespace Delivery\Models\Delivery;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

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
        return $this->attributes["icon"] = $this->attributes["icon"] ?
            \Storage::cloud()->url($this->attributes["icon"]) :
            null;
    }
}
