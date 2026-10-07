<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/08/2020
 * Time: 12:29
 */

namespace App\Models\Price;


use App\Models\Trip\TripType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Price extends Model
{
    protected $table = 'price';

    public function tripType(): BelongsTo
    {
        return $this->belongsTo(TripType::class, 'tripTypeId');
    }
}
