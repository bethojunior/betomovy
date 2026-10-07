<?php

namespace App\Models\Central;

use Illuminate\Database\Eloquent\Model;

class CentralFee extends Model
{
    protected $table = 'centralFee';

    protected $fillable = [
        'returnFee',
        'statusId',
        'isByKm',
        'paidByCentral'
    ];
}
