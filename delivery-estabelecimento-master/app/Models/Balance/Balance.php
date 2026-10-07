<?php

namespace App\Models\Balance;

use Illuminate\Database\Eloquent\Model;

class Balance extends Model
{
    const CREATED_AT = null;
    const UPDATED_AT = null;

    protected $table = 'balance';

    protected $primaryKey = 'idBalance';
}
