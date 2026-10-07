<?php

namespace App\Models\User;

use App\Models\AppPartners\UserTypeLinkedAppPartner;
use App\Models\Trip\TripTypeDriver;
use Illuminate\Database\Eloquent\Model;

class UserType extends Model
{
    const CREATED_AT = null;
    const UPDATED_AT = null;

    protected $table = 'userType';

    protected $primaryKey = 'idUserType';

    protected $fillable = [
        'name',
        'description',
        'isActive',
        'picture',
        'vehicleType',
        'isDeliveryMan',
        'isDriver',
        'iconMapDriverId',
        'acceptedText',
        'boardingText',
        'inProgressText',
        'cancellationText'
    ];

    protected $hidden = [
        'statusId'
    ];

    public function tripTypes()
    {
        return $this->hasMany(TripTypeDriver::class, 'userTypeId');
    }

    public function userTypeLinkedAppPartner()
    {
        return $this->hasMany(UserTypeLinkedAppPartner::class, 'userTypeId');
    }
}
