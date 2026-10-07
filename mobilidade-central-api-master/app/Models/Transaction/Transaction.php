<?php

namespace App\Models\Transaction;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Transaction extends Model
{
    protected $table = 'transaction';

    public $incrementing = true;
    protected $keyType = 'string';

    protected $fillable = [
        'idTransaction',
        'value',
        'intermediary_fee',
        'generatedPaymentId',
        'transactionStatusId',
        'status',
        'status_detailed',
        'paymentFormId',
        'intermediaryId',
        'userId',
    ];
}
