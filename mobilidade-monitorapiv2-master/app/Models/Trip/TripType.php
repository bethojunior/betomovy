<?php

namespace App\Models\Trip;

use App\Models\AppPartners\TripTypePartnerLinked;
use App\Models\CallGroup\CallGroupsTripTypeLinked;
use App\Models\Enum\Gender;
use App\Models\User\UserType;
use Illuminate\Database\Eloquent\Model;

class TripType extends Model
{
    const CREATED_AT = null;
    const UPDATED_AT = null;

    protected $table = 'tripType';

    protected $primaryKey = 'idTripType';

    protected $fillable = [
        'type',
        'picture',
        'description',
        'showType',
        'returnOption',
        'deliveryOption',
        'freightOption',
        'offerOption',
        'onlyCentral',
        'totemOption',
        'openPrice',
        'serviceOption',
        'gender_id',
        'messageNoDriversFound',
        'loopingOption',
        'scheduledOnlyOption'
    ];

    protected $hidden = ['statusId'];

    public function driversType()
    {
        return $this->belongsToMany(
            UserType::class,
            'tripTypeDriver',
            'tripTypeId',
            'userTypeId',
            'idTripType',
            'idUserType');
    }

    public function tripTypeDrivers()
    {
        return $this->hasMany(TripTypeDriver::class, 'tripTypeId');
    }

    public function gender()
    {
        return $this->belongsTo(Gender::class, 'gender_id');
    }

    public function getPictureAttribute()
    {
        return \Storage::cloud()->url('tripType/') . $this->attributes['picture'];
    }

    public function tripTypePartnerLinked() {
        return $this->hasMany(TripTypePartnerLinked::class, 'tripTypePartnerId', 'idTripType');
    }

    public function callGroupsTripTypeLinked()
    {
        return $this->hasMany(CallGroupsTripTypeLinked::class, "tripTypeId", "idTripType");
    }
}
