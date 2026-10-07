<?php

namespace App\Models\Product;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DeliveryCategory extends Model
{
    use SoftDeletes;

    protected $table = 'deliveryCategory';

    public function getPictureAttribute()
    {
        return $this->attributes['picture'] ?
            \Storage::cloud()
                ->url($this->attributes['picture']) :
            null;
    }

    public function products()
    {
        return $this->hasMany(DeliveryProduct::class, "deliveryCategoryId");
    }
}
