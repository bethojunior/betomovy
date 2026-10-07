<?php

namespace App\Models\Notification;

use Illuminate\Database\Eloquent\Model;

class AdminNotificationViews extends Model
{
    protected $table = 'adminNotificationViews';

    const UPDATED_AT = null;
    const CREATED_AT = 'viewed_at';

    protected $fillable = ['adminNotificationId', 'userId'];
}
