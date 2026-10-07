<?php

namespace App\Models\Car;

use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
    protected $table = 'car';
    protected $primaryKey = 'idCar';
    
    protected $fillable = [
        'year', 'plate', 'model', 'color', 'brand', 'driverId'
    ];
}
