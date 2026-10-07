<?php

namespace App\Models\Balance;

use App\Models\User\User;
use Illuminate\Database\Eloquent\Model;

class CreditPrepaidPurchase extends Model
{
    protected $table = 'creditPrepaidPurchase';

    public function creditPrepaid()
    {
        return $this->belongsTo(CreditPrepaid::class, 'creditPrepaidId');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }
}
