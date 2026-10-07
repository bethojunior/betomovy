<?php

namespace App\Models\Balance;

use App\Models\Customer\CustomerView;
use Illuminate\Database\Eloquent\Model;

class Balance extends Model
{
    const UPDATED_AT = null;

    protected $table = 'balance';

    protected $primaryKey = 'idBalance';

    public function customerView()
    {
        return $this->hasOne(CustomerView::class, 'balanceId');
    }
}
