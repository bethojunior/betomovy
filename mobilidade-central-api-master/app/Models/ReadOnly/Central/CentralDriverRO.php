<?php

namespace App\Models\ReadOnly\Central;

use App\Models\ReadOnly\User\DriverRO;
use Illuminate\Database\Eloquent\Model;

class CentralDriverRO extends Model
{
    protected $table = 'centralDriver';

    protected $fillable = [
        'centralId', 'driverId', 'isFavorite'
    ];

    protected $connection = 'mysql_ro';

    public function central()
    {
        return $this->belongsTo(CentralRO::class);
    }

    public function driver()
    {
        return $this->belongsTo(DriverRO::class, 'driverId');
    }
}
