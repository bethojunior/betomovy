<?php

namespace App\Models\Route;

use App\Models\Delivery\TripItemType;
use Illuminate\Database\Eloquent\Model;

class RouteTripItemType extends Model
{
    const UPDATED_AT = null;
    const CREATED_AT = null;

    protected $table = 'routeTripItemType';

    protected $fillable = [
        'routeId',
        'tripItemTypeId',
        'value',
    ];

    protected $hidden = ['statusId'];

    public function tripItemType()
    {
        return $this->belongsTo(TripItemType::class, 'tripItemTypeId');
    }
}
