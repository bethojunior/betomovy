<?php

namespace App\Models\Central;

use Illuminate\Database\Eloquent\Model;

class CentralUser extends Model
{
    protected $table = 'centralUser';

    public function central()
    {
        return $this->belongsTo(Central::class, 'centralId');
    }
}
