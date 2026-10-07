<?php

namespace App\Models\Central;

use App\Models\Trip\TripType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CentralNeighborhood extends Model
{
    use SoftDeletes;

    protected $table = "centralNeighborhood";

    protected $fillable = [
        "value",
        "neighborhoodId",
        "tripTypeId",
        "centralId"
    ];

    public function central()
    {
        return $this->belongsTo(Central::class,"centralId");
    }

    public function neighborhood()
    {
        return $this->belongsTo(Neighborhood::class, "neighborhoodId");
    }

    public function tripType()
    {
        return $this->belongsTo(TripType::class, "tripTypeId");
    }
}
