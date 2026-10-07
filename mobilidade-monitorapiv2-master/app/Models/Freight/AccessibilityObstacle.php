<?php

namespace App\Models\Freight;

use Illuminate\Database\Eloquent\Model;

class AccessibilityObstacle extends Model
{
    protected $table = 'accessibilityObstacle';

    public function accessibility()
    {
        return $this->belongsTo(Accessibility::class, 'accessibilityId');
    }

    public function obstacleOnFloor()
    {
        return $this->belongsTo(ObstacleOnFloor::class, 'obstacleOnFloorId');
    }

    public function action()
    {
        return $this->belongsTo(AccessibilityAction::class, 'actionId');
    }
}
