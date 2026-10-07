<?php

namespace App\Models\Driver;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DriverAddress extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'driverAddress';

    protected $fillable = [
        'driverId',
        'zipCode',
        'street',
        'number',
        'neighborhood',
        'complement',
        'city',
        'state',
    ];

    protected static function booted(): void
    {
        static::saving(function (DriverAddress $toll) {
            if ($toll->zipCode) {
                $toll->zipCode = preg_replace('/[^0-9]/', '', $toll->zipCode);
            }
        });
    }
}
