<?php

namespace App\Models\Product;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DeliveryCategory extends Model
{
    use SoftDeletes;

    protected $table = 'deliveryCategory';

    protected $hidden = [
        'deleted_at'
    ];

    public function deliveryProducts()
    {
        return $this->hasMany(DeliveryProduct::class, 'deliveryCategoryId');
    }

    public function getPictureAttribute()
    {
        return $this->attributes['picture'] = $this->attributes['picture'] ?
            \Storage::cloud()
                ->url($this->attributes['picture']) :
            null;
    }
}
