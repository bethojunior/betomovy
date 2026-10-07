<?php

namespace App\Models\Trip;

use App\Models\User\UserType;
use Illuminate\Database\Eloquent\Model;

class TripTypeDriver extends Model
{
    const CREATED_AT = null;
    const UPDATED_AT = null;

    protected $table = 'tripTypeDriver';

    protected $fillable = [
        'tripTypeId',
        'userTypeId',
    ];

    public function tripType()
    {
        return $this->belongsTo(TripType::class, 'tripTypeId');
    }

    public function userType()
    {
        return $this->belongsTo(UserType::class, 'userTypeId');
    }
}
