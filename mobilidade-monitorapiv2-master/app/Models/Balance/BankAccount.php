<?php

namespace App\Models\Balance;

use App\Models\Enum\Bank;
use Illuminate\Database\Eloquent\Model;

class BankAccount extends Model
{
    protected $table = "bankAccount";

    protected $primaryKey = "idBankAccount";

    public function bank()
    {
        return $this->belongsTo(Bank::class, "bankId");
    }
}
