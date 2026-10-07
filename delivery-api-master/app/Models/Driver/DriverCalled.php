<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 08/07/2020
 * Time: 15:19
 */

namespace App\Models\Driver;


use Illuminate\Database\Eloquent\Model;

class DriverCalled extends Model
{
    protected $table = 'driverCalled';

    protected $fillable = [
        'driverId',
        'tripReference',
        'proximity',
        'destinationProximity'
    ];

    public function driver()
    {
        return $this->belongsTo(Driver::class, 'driverId');
    }
}
