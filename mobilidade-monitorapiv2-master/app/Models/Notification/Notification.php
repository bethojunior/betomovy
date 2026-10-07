<?php

namespace App\Models\Notification;

use App\Models\Locale\City;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Notification extends Model
{
    protected $table = 'notification';

    protected $primaryKey = 'idNotification';

    protected $fillable = [
        'title',
        'message',
        'link',
        'image',
        'notificationTypeId',
        'date',
        'dateSend',
        'userTypeId',
        'statusId',
        'usersId',
        'cityId',
        'identifyUserInLink',
    ];
    public const CREATED_AT = 'date';
    public const UPDATED_AT = null;

    public function getPictureAttribute()
    {
        return $this->attributes['picture'] ?
            Storage::cloud()->url($this->attributes['picture']) : null;
    }

    public function notificationUserTypes()
    {
        return $this->hasMany(NotificationUserType::class,"notificationId");
    }

    public function city()
    {
        return $this->belongsTo(City::class,"cityId");
    }
}
