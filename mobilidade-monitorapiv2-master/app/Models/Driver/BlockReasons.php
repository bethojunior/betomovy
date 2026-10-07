<?php

namespace App\Models\Driver;

use Illuminate\Database\Eloquent\Model;

class BlockReasons extends Model
{
    protected $primaryKey = 'idBlockReasons';

    protected $table = 'blockReasons';

    protected $fillable = [
        'blockReasonsTypeId',
        'driverId',
        'statusId',
    ];

    const UPDATED_AT = null;
    const CREATED_AT = 'date';
}
