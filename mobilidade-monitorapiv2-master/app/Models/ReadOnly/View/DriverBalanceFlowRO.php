<?php

namespace App\Models\ReadOnly\View;

use Illuminate\Database\Eloquent\Model;

class DriverBalanceFlowRO extends Model
{
    protected $table = 'driver_balance_flow_view';

    protected $connection = 'mysql_ro';
}
