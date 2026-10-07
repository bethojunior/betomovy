<?php

namespace App\Models\Product;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DeliveryProduct extends Model
{
    use SoftDeletes;

    protected $table = 'deliveryProduct';

    protected $fillable = [
        'companyId',
        'name',
        'deliveryCategoryId',
        'description',
        'costPrice',
        'price',
        'preparationTime',
        'freeDelivery',
        'isOpenValue'
    ];

    public function deliveryCategory()
    {
        return $this->belongsTo(DeliveryCategory::class, 'deliveryCategoryId');
    }

    public function deliveryGroupComplements()
    {
        return $this->hasMany(DeliveryGroupComplement::class, 'deliveryProductId');
    }

    public function setFreeDeliveryAttribute($value)
    {
        $this->attributes['freeDelivery'] = (bool) $value;
    }

    public function getPictureAttribute()
    {
        return $this->attributes['picture'] ?
            \Storage::cloud()
                ->url($this->attributes['picture']) :
            null;
    }
}
