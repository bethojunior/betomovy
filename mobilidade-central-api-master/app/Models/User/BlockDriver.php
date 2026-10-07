<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Model;

class BlockDriver extends Model
{
    protected $table = 'refusedDriver';

    protected $primaryKey = 'id';

    const UPDATED_AT = null;
    const CREATED_AT = null;

    protected $fillable = [
        'customerId',
        'driverId',
        'centralId',
        'statusId',
        'created_at',
        'updated_at'
    ];

}
