<?php

namespace App\Models\Product;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DeliveryGroupComplement extends Model
{
    use SoftDeletes;

    protected $table = 'deliveryGroupComplement';

    protected $hidden = [
        'deleted_at'
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
