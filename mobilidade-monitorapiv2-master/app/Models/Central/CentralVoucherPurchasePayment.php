<?php

namespace App\Models\Central;

use App\Models\Config\PaymentForm;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CentralVoucherPurchasePayment extends Model
{
    protected $table = 'centralVoucherPurchasePayment';

    protected $fillable = [
        'paymentFormId',
        'statusId',
        'isActive'
    ];

    public function paymentForm(): BelongsTo
    {
        return $this->belongsTo(PaymentForm::class, 'paymentFormId', 'idPaymentForm');
    }
}
