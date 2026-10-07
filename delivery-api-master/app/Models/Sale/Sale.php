<?php

namespace App\Models\Sale;

use App\Models\Merchant\Merchant;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    protected $table = 'sale';

    public function merchant()
    {
        return $this->belongsTo(Merchant::class, 'merchantId');
    }

    public function saleStatus()
    {
        return $this->belongsTo(SaleStatus::class, 'saleStatusId');
    }

    public function saleProductMerchant()
    {
        return $this->hasMany(SaleProductMerchant::class, 'saleId');
    }
}
