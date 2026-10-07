<?php

namespace App\Models\Delivery;

use App\Models\Config\PaymentFormType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DeliveryPaymentForm extends Model
{
    use SoftDeletes;

    protected $table = 'deliveryPaymentForm';

    protected $fillable = [
        'paymentFormTypeId',
        'name'
    ];

    public function paymentFormType()
    {
        return $this->belongsTo(PaymentFormType::class, 'paymentFormTypeId');
    }
}
