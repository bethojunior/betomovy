<?php

namespace App\Models\User;

use App\Models\Balance\Balance;
use App\Models\Central\CentralUser;
use App\Models\User\Doc\DocUser;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $table = 'customer';

    protected $primaryKey = 'idCustomer';

    const UPDATED_AT = null;
    const CREATED_AT = null;

    public function balance()
    {
        return $this->belongsTo(Balance::class, 'balanceId');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }

    public function docUser()
    {
        return $this->hasMany(DocUser::class, 'userId');
    }
}
