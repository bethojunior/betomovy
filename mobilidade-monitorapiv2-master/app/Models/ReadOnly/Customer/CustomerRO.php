<?php

namespace App\Models\ReadOnly\Customer;

use Illuminate\Database\Eloquent\Model;

class CustomerRO extends Model
{
    protected $table = 'customer';

    protected $primaryKey = 'idCustomer';

    protected $connection = 'mysql_ro';
}
