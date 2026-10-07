<?php

namespace App\Models\Price;

use App\Models\Freight\AccessibilityHelp;
use Illuminate\Database\Eloquent\Model;

class PriceHelp extends Model
{
    protected $table = 'priceHelp';

    public function accessibilityHelp()
    {
        return $this->belongsTo(AccessibilityHelp::class, 'accessibilityHelpId');
    }
}
