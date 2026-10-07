<?php

namespace Delivery\Models\Order;

use Delivery\Models\Product\DeliveryProduct;
use Illuminate\Database\Eloquent\Model;

class DeliveryOrderItem extends Model
{
    protected $table = 'deliveryOrderItem';

    protected $fillable = [
        'quantity',
        'deliveryProductId',
        'value',
        'obs',
    ];

    public function deliveryProduct()
    {
        return $this->belongsTo(DeliveryProduct::class, 'deliveryProductId');
    }

    public function deliveryOrderComplements()
    {
        return $this->hasMany(DeliveryOrderComplement::class, 'deliveryOrderItemId');
    }
}
