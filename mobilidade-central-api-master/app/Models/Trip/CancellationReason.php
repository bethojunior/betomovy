<?php

namespace App\Models\Trip;

use Illuminate\Database\Eloquent\Model;

class CancellationReason extends Model
{
    protected $table = 'cancellationReasons';
    protected $primaryKey = 'idCancellationReasons';
    
    protected $fillable = [
        'name', 'statusId', 'cancellationReasonsTypeId', 'reports', 'monetized'
    ];
}