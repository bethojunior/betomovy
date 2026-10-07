<?php

namespace App\Models\Driver;

use Illuminate\Database\Eloquent\Model;

class PendencyReasons extends Model
{
    protected $primaryKey = 'idPendencyReasons';

    protected $table = 'pendencyReasons';

    const UPDATED_AT = null;
}
