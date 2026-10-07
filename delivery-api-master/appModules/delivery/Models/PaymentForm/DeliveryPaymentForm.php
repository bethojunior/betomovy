<?php

namespace Delivery\Models\PaymentForm;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DeliveryPaymentForm extends Model
{
    protected $table = 'deliveryPaymentForm';

    protected $hidden = [
        'deleted_at'
    ];
}
