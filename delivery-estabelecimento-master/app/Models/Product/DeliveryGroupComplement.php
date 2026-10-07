<?php

namespace App\Models\Product;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DeliveryGroupComplement extends Model
{
    use SoftDeletes;

    protected $table = 'deliveryGroupComplement';

    protected $fillable = [
        'name',
        'minimumQuantity',
        'maximumQuantity',
        'required',
        'deliveryProductId',
    ];

    public function deliveryProduct()
    {
        return $this->belongsTo(DeliveryProduct::class, 'deliveryProductId');
    }

    public function deliveryComplements()
    {
        return $this->hasMany(DeliveryComplement::class, 'deliveryGroupComplementId');
    }
}
