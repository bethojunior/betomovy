<?php

namespace App\Models\Balance;

use App\Models\Config\PaymentForm;
use Illuminate\Database\Eloquent\Model;

class CreditPrepaidPaymentForm extends Model
{
    protected $table = 'creditPrepaidPaymentForm';

    protected $fillable = [
        'paymentFormId',
        'creditPrepaidId'
    ];

    public function paymentForm()
    {
        return $this->belongsTo(PaymentForm::class, 'paymentFormId');
    }
}
