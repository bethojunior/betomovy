<?php


namespace App\Models\Promotion;


use Illuminate\Database\Eloquent\Model;

class VoucherPromotion extends Model
{
    protected $table = 'voucherPromotion';
    protected $fillable = [
        'amount',
        'value',
        'percentage',
        'cityId',
        'user'
    ];
}
