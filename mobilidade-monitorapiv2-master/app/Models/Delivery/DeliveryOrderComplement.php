<?php

namespace Delivery\Models\OrderDelivery;

use Delivery\Models\Product\DeliveryComplement;
use Illuminate\Database\Eloquent\Model;

class DeliveryOrderComplement extends Model
{
    protected $table = 'deliveryOrderComplement';

    protected $fillable = [
        'quantity',
        'deliveryComplementId'
    ];

    public function deliveryComplement()
    {
        return $this->belongsTo(DeliveryComplement::class, 'deliveryComplementId');
    }
}
