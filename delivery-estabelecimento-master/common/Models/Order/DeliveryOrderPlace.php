<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 18/06/2020
 * Time: 11:04
 */

namespace Common\Models\Order;


use Common\Models\Place\Place;
use Illuminate\Database\Eloquent\Model;

class DeliveryOrderPlace extends Model
{
    protected $table = 'deliveryOrderPlace';

    public function place()
    {
        return $this->belongsTo(Place::class, 'placeId');
    }
}
