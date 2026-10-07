<?php

namespace App\Models\Balance;

use Illuminate\Database\Eloquent\Model;

class SaleBalanceFlow extends Model
{
    const CREATED_AT = null;
    const UPDATED_AT = null;

    protected $table = 'saleBalanceFlow';

    protected $fillable = ['saleId', 'balanceFlowId'];
}
