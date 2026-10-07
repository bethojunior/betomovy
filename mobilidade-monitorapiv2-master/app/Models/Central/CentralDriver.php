<?php

namespace App\Models\Central;

use App\Models\User\Driver;
use Illuminate\Database\Eloquent\Model;

class CentralDriver extends Model
{
    protected $table = 'centralDriver';

    protected $fillable = [
        'centralId', 'driverId'
    ];

    public function central()
    {
        return $this->belongsTo(Central::class);
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class, 'driverId');
    }
}
