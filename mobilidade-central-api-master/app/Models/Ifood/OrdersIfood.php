<?php

namespace App\Models\Ifood;


use Illuminate\Database\Eloquent\Model;

class OrdersIfood extends Model
{
    protected $table = 'ifood_orders';

    protected $fillable = [
        'orderId',
        'fullCode',
        'tripRefference',
        'centralId',
        'DELIVERY_DROP_CODE_REQUESTED'
    ];
}
