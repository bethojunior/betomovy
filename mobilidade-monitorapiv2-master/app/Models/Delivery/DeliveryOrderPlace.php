<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/06/2020
 * Time: 18:10
 */

namespace App\Models\Delivery;


use App\Models\Places\Place;
use Illuminate\Database\Eloquent\Model;

class DeliveryOrderPlace extends Model
{
    protected $table = 'deliveryOrderPlace';

    public function place()
    {
        return $this->belongsTo(Place::class, 'placeId');
    }
}
