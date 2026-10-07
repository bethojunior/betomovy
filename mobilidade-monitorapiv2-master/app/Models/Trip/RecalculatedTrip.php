<?php

namespace App\Models\Trip;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

class RecalculatedTrip extends Model
{
    protected $table = 'recalculatedTrip';

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }
}
