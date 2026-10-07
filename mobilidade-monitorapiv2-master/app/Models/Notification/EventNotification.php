<?php

namespace App\Models\Notification;

use Illuminate\Database\Eloquent\Model;

class EventNotification extends Model
{
    protected $table = "eventNotification";

    protected $fillable = [
        "title",
        "description",
        "eventNotificationTypeId",
        "statusId"
    ];

    public function eventNotificationType()
    {
        return $this->belongsTo(EventNotificationType::class, "eventNotificationTypeId");
    }
}
