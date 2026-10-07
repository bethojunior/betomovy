<?php

namespace App\Models\Sale;

use App\Models\Product\ProductMerchant;
use Illuminate\Database\Eloquent\Model;

class SaleProductMerchant extends Model
{
    protected $table = 'saleProductMerchant';

    public function productMerchant()
    {
        return $this->belongsTo(ProductMerchant::class, "productMerchantId");
    }
}
