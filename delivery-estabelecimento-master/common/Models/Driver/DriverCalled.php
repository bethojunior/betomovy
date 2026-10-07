<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 09/07/2020
 * Time: 11:11
 */

namespace Common\Models\Driver;


use Illuminate\Database\Eloquent\Model;

class DriverCalled extends Model
{
    protected $table = 'driverCalled';

    protected $fillable = [
        'driverId',
        'deliveryOrderId',
        'proximity',
        'status'
    ];
}
