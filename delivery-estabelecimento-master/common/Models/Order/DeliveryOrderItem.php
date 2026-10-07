<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 16/06/2020
 * Time: 18:06
 */

namespace Common\Models\Order;


use Illuminate\Database\Eloquent\Model;

class DeliveryOrderItem extends Model
{
    protected $table = 'deliveryOrderItem';

    public function deliveryProduct()
    {
        return $this->belongsTo(DeliveryProduct::class, 'deliveryProductId');
    }

    public function deliveryOrderComplements()
    {
        return $this->hasMany(DeliveryOrderComplement::class, 'deliveryOrderItemId');
    }
}
