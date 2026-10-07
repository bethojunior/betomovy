<?php

namespace App\Models\Freight;

use Illuminate\Database\Eloquent\Model;

class FreightItem extends Model
{
    protected $table = 'freightItem';

    public function item()
    {
        return $this->belongsTo(Item::class, 'itemId');
    }
}
