<?php


namespace Delivery\Models\Order;


use Illuminate\Database\Eloquent\Model;

class DeliveryRating extends Model
{
    protected $table = "deliveryRating";

    protected $fillable = [
        'ratingOfTheEstablishment',
        'deliveryQuality',
        'priceRange',
        'deliveryOrderId',
        'driverId',
        'companyId'
    ];
}
