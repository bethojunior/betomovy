<?php

namespace App\Models\Utils;

use App\Models\Locale\City;
use App\Models\Trip\TripType;
use Illuminate\Database\Eloquent\Model;

class ManagementWppGroupNotification extends Model
{
    protected $table = 'managment_wpp_group_notifications';

    protected $fillable = [
        'cityId',
        'tripTypeId',
        'group_id',
        'group_name',
        'reference',
        'message',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
        'cityId' => 'integer',
        'tripTypeId' => 'integer',
    ];

    public function city()
    {
        return $this->belongsTo(City::class, 'cityId', 'id');
    }

    public function tripType()
    {
        return $this->belongsTo(TripType::class, 'tripTypeId', 'idTripType');
    }
}
