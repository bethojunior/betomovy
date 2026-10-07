<?php

namespace App\Models\Notification;

use App\Models\Role\UserGroup;
use App\Models\User\Driver;
use App\Models\User\User;
use App\Models\Trip\Trip;
use Illuminate\Database\Eloquent\Model;

class AdminNotification extends Model
{
    protected $table = 'adminNotification';

    protected $fillable = [
        'userId',
        'adminNotificationTypeId',
        'message',
        'title'
    ];

    public function adminNotificationType()
    {
        return $this->belongsTo(AdminNotificationType::class, 'adminNotificationTypeId');
    }

    public function userGroup()
    {
        return $this->belongsTo(UserGroup::class, 'userGroupId');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }

    public function readBy()
    {
        return $this->belongsTo(User::class, 'userId');
    }

    public function views()
    {
        return $this->hasMany(AdminNotificationViews::class, 'adminNotificationId');
    }

    public function emergencyMonitoringType()
    {
        return $this->belongsTo(EmergencyMonitoringType::class, 'emergencyMonitoringTypeId');
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class, 'userId', 'userId');
    }

    public function trip()
    {
        return $this->belongsTo(Trip::class, 'tripReference', 'tripReference');
    }
}
