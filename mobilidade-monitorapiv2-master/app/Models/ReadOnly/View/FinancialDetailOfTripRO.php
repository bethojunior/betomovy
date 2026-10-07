<?php

namespace App\Models\ReadOnly\View;

use Illuminate\Database\Eloquent\Model;

class FinancialDetailOfTripRO extends Model
{
    protected $table = 'financial_detail_of_trip_view';

    protected $connection = 'mysql_ro';

    protected $dates = ['date'];
}
