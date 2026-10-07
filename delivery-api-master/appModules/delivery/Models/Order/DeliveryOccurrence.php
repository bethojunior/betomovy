<?php


namespace Delivery\Models\Order;


use Illuminate\Database\Eloquent\Model;

class DeliveryOccurrence extends Model
{
    protected $table = "deliveryOccurrence";

    protected $fillable = [
        "message",
        "latitude",
        "longitude",
        "deliveryOrderId"
    ];
}
