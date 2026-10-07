<?php

namespace App\Models\Freight;

use Illuminate\Database\Eloquent\Model;

class AccessibilityAssistant extends Model
{
    protected $table = 'accessibilityAssistant';

    public function accessibility()
    {
        return $this->belongsTo(Accessibility::class, 'accessibilityId');
    }

    public function help()
    {
        return $this->belongsTo(AccessibilityHelp::class, 'helpId');
    }

    public function action()
    {
        return $this->belongsTo(AccessibilityAction::class, 'actionId');
    }
}
