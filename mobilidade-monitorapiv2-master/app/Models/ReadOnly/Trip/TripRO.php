<?php

namespace App\Models\ReadOnly\Trip;

use App\Models\Trip\TripWayPoint;
use App\Utils\UUID;
use Illuminate\Database\Eloquent\Model;

class TripRO extends Model
{
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->attributes['tripReference'] = $attributes['tripReference'] ?? UUID::v4();
    }

    const UPDATED_AT = null;

    const CREATED_AT = 'date';

    protected $table = 'trip';

    protected $primaryKey = 'idTrip';

    protected $connection = 'mysql_ro';

    protected $fillable = [
        "cityId",
        "tripTypeId",
        "priceId",
        "price",
        "tripPaymentFormId",
        "centralId"
    ];

    public function tripWayPoints()
    {
        return $this->hasMany(
            TripWayPoint::class, 'tripReference', 'tripReference');
    }
}
