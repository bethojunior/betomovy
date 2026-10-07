<?php

namespace App\Models\ReadOnly\User;

use Illuminate\Database\Eloquent\Model;

class CustomerRO extends Model
{
    const UPDATED_AT = null;
    const CREATED_AT = null;

    protected $table = 'customer';

    protected $primaryKey = 'idCustomer';

    protected $connection = 'mysql_ro';
}
