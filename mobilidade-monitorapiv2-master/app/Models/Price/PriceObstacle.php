<?php

namespace App\Models\Price;

use App\Models\Freight\ObstacleOnFloor;
use Illuminate\Database\Eloquent\Model;

class PriceObstacle extends Model
{
    protected $table = 'priceObstacle';

    public function obstacle()
    {
        return $this->belongsTo(ObstacleOnFloor::class, 'obstacleOnFloorId');
    }
}
