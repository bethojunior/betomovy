<?php

namespace App\Models\Balance;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CreditPrepaid extends Model
{
    use SoftDeletes;

    protected $table = 'creditPrepaid';

    protected $fillable = [
        'stripe',
        'title',
        'superTitle',
        'purchasePrice',
        'sellPrice',
        'accountInformation',
        'type',
        'cityId',
        'quantityDaysSold',
        'quantityDaysPurchased',
    ];

    public function creditPrepaidPaymentForm()
    {
        return $this->hasMany(CreditPrepaidPaymentForm::class, 'creditPrepaidId');
    }
}
