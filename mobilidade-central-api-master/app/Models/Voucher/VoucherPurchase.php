<?php

namespace App\Models\Voucher;

use Illuminate\Database\Eloquent\Model;

class VoucherPurchase extends Model
{
    protected $table = 'voucherPurchase';

    protected $fillable = [
        'idVoucherPurchase',
        'status',
        'status_detail',
        'amount',
        'value',
        'captured',
        'captured_amount',
        'userId',
        'cardId',
        'transactionId'
    ];
}
