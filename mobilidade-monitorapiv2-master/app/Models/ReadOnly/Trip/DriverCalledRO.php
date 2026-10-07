<?php

namespace App\Models\ReadOnly\Trip;

use Illuminate\Database\Eloquent\Model;

class DriverCalledRO extends Model
{
    protected $table = 'driverCalled';

    protected $connection = 'mysql_ro';
}
