<?php

namespace App\Models\Route;

use App\Models\Trip\Destination;
use App\Models\Trip\Origin;
use Illuminate\Database\Eloquent\Model;

class Route extends Model
{
    protected $table = 'route';

    protected $fillable = [
        'name',
        'price',
        'priceId',
        'cityId',
        'estimatedTime',
        'estimatedDistance',
        'allowCustomerStops',
        'active',
        'defaultLayout',
        'tripTypeId',
        'picture',
    ];

    protected $hidden = ['statusId'];

    public function getPictureAttribute()
    {
        return $this->attributes['picture'] ?
            \Storage::cloud()
                ->url($this->attributes['picture']) :
            null;
    }

    public function origin()
    {
        return $this->belongsTo(Origin::class, 'originId');
    }

    public function destination()
    {
        return $this->belongsTo(Destination::class, 'destinationId');
    }

    public function routeWayPoints()
    {
        return $this->hasMany(RouteWayPoint::class, 'routeId');
    }

    public function routeTripItemTypes()
    {
        return $this->hasMany(RouteTripItemType::class, 'routeId');
    }
}
