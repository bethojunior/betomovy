<?php


namespace Common\Models\Order;


use Illuminate\Database\Eloquent\Model;

class DeliveryPaymentTransactions extends Model
{
    protected $table = 'deliveryPaymentTransactions';
    protected $fillable = [
        'paymentId',
        'value',
        'status',
        'deliveryOrderId',
    ];
}
