<?php

namespace App\Models\Trip\ChatTrip;

use Illuminate\Database\Eloquent\Model;

class ChatTrip extends Model
{
    protected $table = 'chatTrip';

    const CREATED_AT = 'date';
    const UPDATED_AT = null;

    protected $fillable = [
        'tripReference', 'driverId', 'userId'
    ];

    protected $primaryKey = 'idChatTrip';
}
