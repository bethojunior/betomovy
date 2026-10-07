<?php

namespace App\Models\Product;

use App\Models\Product\DeliveryCategory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DeliveryProduct extends Model
{
    use SoftDeletes;

    protected $table = 'deliveryProduct';

    protected $hidden = [
        'deleted_at'
    ];

    public function deliveryCategory()
    {
        return $this->belongsTo(DeliveryCategory::class, 'deliveryCategoryId');
    }

    public function deliveryGroupComplements()
    {
        return $this->hasMany(DeliveryGroupComplement::class, 'deliveryProductId');
    }

    public function getPictureAttribute()
    {
        return $this->attributes['picture'] = $this->attributes['picture'] ?
            \Storage::cloud()
                ->url($this->attributes['picture']) :
            null;
    }
}
