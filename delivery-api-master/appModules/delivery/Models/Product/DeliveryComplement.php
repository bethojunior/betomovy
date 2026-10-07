<?php

namespace Delivery\Models\Product;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DeliveryComplement extends Model
{
    use SoftDeletes;

    protected $table = 'deliveryComplement';

    protected $hidden = [
        'deleted_at'
    ];

    public function deliveryGroupComplement()
    {
        return $this->belongsTo(DeliveryGroupComplement::class, 'deliveryGroupComplementId');
    }
}
