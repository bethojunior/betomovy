<?php

namespace App\Models\Freight;

use Illuminate\Database\Eloquent\Model;

class Accessibility extends Model
{
    protected $table = 'accessibility';

    const UPDATED_AT = null;

    public function assistants()
    {
        return $this->hasMany(
            AccessibilityAssistant::class, 'accessibilityId');
    }

    public function obstacles()
    {
        return $this->hasMany(
            AccessibilityObstacle::class, 'accessibilityId');
    }
}
