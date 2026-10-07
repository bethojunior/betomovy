<?php

namespace App\Models\TripTax;

use Illuminate\Database\Eloquent\Model;

class TripTax extends Model
{
    protected $table = 'tripTax';

    protected $fillable = [
        'id',
        'tripId',
        'taxId',
        'create_at',
        'updated_at',
    ];
    
}
