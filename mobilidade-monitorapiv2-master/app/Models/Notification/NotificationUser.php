<?php


namespace App\Models\Notification;



use Illuminate\Database\Eloquent\Model;

class NotificationUser extends Model
{
    protected $table = 'notificationUser';
    protected $fillable = [
        'notificationId',
        'userId'
    ];
    public $timestamps = ['created_at'];
}
