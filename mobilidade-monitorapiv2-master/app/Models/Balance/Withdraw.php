<?php

namespace App\Models\Balance;

use App\Models\User\User;
use Illuminate\Database\Eloquent\Model;

class Withdraw extends Model
{
    const UPDATED_AT = null;

    protected $table = 'withdraw';

    protected $primaryKey = 'idWithdraw';

    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }

    public function balance()
    {
        return $this->belongsTo(Balance::class, 'balanceId');
    }
}
