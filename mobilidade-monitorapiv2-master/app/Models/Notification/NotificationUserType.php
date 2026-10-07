<?php


namespace App\Models\Notification;


use Illuminate\Database\Eloquent\Model;

class NotificationUserType extends Model
{
    protected $table = 'notificationUserType';
    protected $fillable = [
        'userTypeId',
        'notificationId'
    ];
    public $timestamps = ['created_at'];
}
